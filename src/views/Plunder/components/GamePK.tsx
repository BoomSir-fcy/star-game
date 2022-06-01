import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { Box, Button, Flex, Text, PrimaryInput, ResetCSS } from 'uikit';
import { Api } from 'apis';
import {
  useFetchGamePlanetUnits,
  useFetchUnitList,
  useFetchGamePK,
  useFetchGamePKTest,
  useFetchGameTerrain,
} from 'state/game/hooks';
import Soldier from 'game/core/Soldier';
import { useStore } from 'state';
import Game from 'game/core/Game';
import { GamePkInfo, RoundInitState } from 'state/types';

import {
  RoundInfo,
  RoundDescMove,
  RoundDescAttack,
  MapBaseUnits,
} from 'game/types';
import useParsedQueryString from 'hooks/useParsedQueryString';
import { fetchUnitListAsync } from 'state/game/reducer';
import { fetchPlanetInfoAsync } from 'state/planet/fetchers';
import { useDispatch } from 'react-redux';
import Running, { RoundsProps } from 'game/core/Running';
import { useNavigate } from 'react-router-dom';
import { OptionProps, Select } from 'components/Select';
import effectConfig from 'game/effectConfig';
import Progress from 'components/Progress';
import speeder from 'game/core/Speeder';

const sleep = (handle: any, delay: number) => {
  return new Promise<void>((res, rej) => {
    setTimeout(() => {
      try {
        handle();
        res();
      } catch (error) {
        rej(error);
      }
    }, delay);
  });
};

interface GamePKProps {
  pid0?: number;
  pid1?: number;
}

type idMap = { [xy: string]: string };

const game = new Game({ width: 900, height: 600, test: true });

const GamePK: React.FC<GamePKProps> = () => {
  useFetchGameTerrain();

  const [running, setRunning] = useState<Running | null>(null);
  const PKInfo = useStore(p => p.game.PKInfo);

  const navigate = useNavigate();

  const parsedQs = useParsedQueryString();
  const units = useStore(p => p.game.baseUnits);
  const dispatch = useDispatch();

  const [pid0, setPid0] = useState((parsedQs.pid0 as string) || '');
  const [pid1, setPid1] = useState((parsedQs.pid1 as string) || '');
  const [ActiveTerrainInfo, setActiveTerrainInfo] = useState<OptionProps>();
  const [maxRound, setMaxRound] = useState('10');
  const { TerrainInfo } = useStore(p => p.game);

  const planetInfo = useStore(p => p.planet.planetInfo);

  const infoP0 = useMemo(() => {
    return planetInfo[Number(pid0)];
  }, [planetInfo, pid0]);

  const infoP1 = useMemo(() => {
    return planetInfo[Number(pid1)];
  }, [planetInfo, pid1]);

  useEffect(() => {
    if (infoP0?.race && infoP1?.race) {
      dispatch(fetchUnitListAsync(infoP0?.race));
      dispatch(fetchUnitListAsync(infoP1?.race));
    }
  }, [dispatch, infoP0?.race, infoP1?.race]);

  useEffect(() => {
    if (parsedQs.terrain) {
      setActiveTerrainInfo(JSON.parse(String(parsedQs.terrain)));
    }
  }, [parsedQs]);

  useEffect(() => {
    if (TerrainInfo?.length && ActiveTerrainInfo) {
      game.creatTerrain(TerrainInfo[ActiveTerrainInfo?.value]?.terrains);
    } else {
      game.creatTerrain([]);
    }
  }, [TerrainInfo, ActiveTerrainInfo]);

  const startHandle = useCallback(() => {
    if (Number(pid0) && Number(pid1)) {
      dispatch(fetchPlanetInfoAsync([Number(pid0), Number(pid1)]));
      navigate(
        `/plunder-test?pid0=${pid0}&pid1=${pid1}&terrain=${JSON.stringify(
          ActiveTerrainInfo,
        )}`,
        { replace: true },
      );
    } else if (Number(pid0)) {
      dispatch(fetchPlanetInfoAsync([Number(pid0)]));
    }
  }, [dispatch, pid0, pid1, navigate, ActiveTerrainInfo]);

  useFetchGamePK(infoP0?.id, infoP1?.id, Number(maxRound));
  useFetchGamePKTest(
    infoP0?.id,
    infoP1?.id,
    Number(maxRound),
    parsedQs.terrain ? Number(JSON.parse(String(parsedQs.terrain))?.id) : 0,
  );

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.appendChild(game.view);
    }
  }, [ref]);

  const createSoldiers = useCallback(
    (
      poses: Api.Game.UnitPlanetPos[],
      base: MapBaseUnits,
      ids: idMap,
      isEnemy: boolean,
    ) => {
      poses?.forEach(item => {
        game.createSoldier(item.pos.x, item.pos.y, {
          srcId: `${item.base_unit_id % 30}`,
          race: base[item.base_unit_id]?.race || 1,
          id: item.base_unit_id,
          sid: ids[`${item.pos.x}${item.pos.y}`],
          hp: base[item.base_unit_id]?.hp,
          isEnemy,
          enableDrag: false,
          unique_id: item.base_unit_id,
          // attackId: base[item.base_unit_id].unique_id
        });
      });
    },
    [],
  );

  const [runningInfo, setRunningInfo] = useState<{
    rate: number;
    playCount: string;
  }>({
    rate: 1,
    playCount: '1',
  });

  const runHandle = useCallback(
    (info: GamePkInfo) => {
      const _running = new Running(game, {
        round: info.slot,
        base: info.init.base_unit,
      });
      setRunning(_running);
      setTimeout(() => {
        _running.play();
      }, 3000);
      setRunningInfo(prev => {
        return {
          ...prev,
          playCount: `${_running.playCount}`,
        };
      });
    },
    [setRunning, setRunningInfo],
  );

  const [selectOptions, setSelectOptions] = useState<OptionProps[]>([]);

  const initHandle = useCallback(() => {
    if (PKInfo && game.soldiers.length === 0) {
      const ids: idMap = {};
      Object.keys(PKInfo?.[0]?.init?.ids).forEach(id => {
        const { x, y } = PKInfo?.[0].init.ids[id];
        ids[`${x}${y}`] = id;
      });

      createSoldiers(
        PKInfo?.[0].init.blue_units,
        PKInfo?.[0].init.base_unit,
        ids,
        false,
      );
      createSoldiers(
        PKInfo?.[0].init.red_units,
        PKInfo?.[0].init.base_unit,
        ids,
        true,
      );
      runHandle(PKInfo?.[0]);
      const res: OptionProps[] = [];
      Object.keys(PKInfo?.[0].status.status).forEach((item: string) => {
        res.push({
          value: `回合${item}`,
          label: `回合${item}`,
          info: PKInfo?.[0].status.status[item],
          id: `${item}-0`,
        });
      });
      setSelectOptions(res);
    }
  }, [PKInfo, createSoldiers, runHandle, setSelectOptions]);

  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (PKInfo && game.soldiers.length === 0 && !loaded) {
      setLoaded(true);
      const loaders = game.loadResources();
      loaders.addEventListener('progress', event => {
        setProgress((event as ProgressEvent).loaded);
      });
      loaders.addEventListener('complete', () => {
        initHandle();
      });
      // initHandle
    }
  }, [PKInfo, initHandle, loaded, setLoaded]);

  const resetSolider = useCallback(() => {
    game.clearSoldier();

    if (PKInfo && game.soldiers.length === 0) {
      const ids: idMap = {};
      Object.keys(PKInfo?.[0].init.ids).forEach(id => {
        const { x, y } = PKInfo?.[0].init.ids[id];
        ids[`${x}${y}`] = id;
      });
      createSoldiers(
        PKInfo?.[0].init.blue_units,
        PKInfo?.[0].init.base_unit,
        ids,
        false,
      );
      createSoldiers(
        PKInfo?.[0].init.red_units,
        PKInfo?.[0].init.base_unit,
        ids,
        true,
      );
      // runHandle(PKInfo.slot);
    }
  }, [PKInfo, createSoldiers]);

  const selectHandle = useCallback(
    (info: RoundInitState[], id: string) => {
      running?.pause();

      game.clearSoldier();
      info.forEach(item => {
        game.createSoldier(item.pos.x, item.pos.y, {
          srcId: `${item.base_id % 30}`,
          race: PKInfo?.[0]?.init.base_unit[item.base_id].race || 1,
          id: item.base_id,
          hp: PKInfo?.[0]?.init.base_unit[item.base_id].hp,
          isEnemy: item.red,
          enableDrag: false,
          unique_id: item.base_id,
          activePh: item.hp,
          // attackId: base[item.base_unit_id].unique_id
        });
      });

      running?.setTrackIndexById(id);
      // running?.trackIndex = 10;
    },
    [running, PKInfo],
  );

  const testHandle = useCallback(() => {
    game.loadResources();
    game.createSoldier(0, 7, {
      srcId: '3',
      race: 1,

      id: 1,
      unique_id: 1,
      hp: 290,
      isEnemy: false,
      enableDrag: true,
      shield: 500,
    });
    game.createSoldier(7, 7, {
      srcId: '1',
      race: 1,
      id: 1,
      unique_id: 1,
      hp: 300,
      isEnemy: true,
      enableDrag: true,
    });
  }, []);

  const bulletSelect: OptionProps[] = useMemo(() => {
    return effectConfig.bullet.map((item, index) => ({
      value: item.name,
      label: item.label || item.name,
      id: index,
    }));
  }, []);

  const [activeBullet, setActiveBullet] = useState(bulletSelect[0]);

  const sendHandle = useCallback(() => {
    // const [s1, s0] = game.soldiers;
    const [s0, s1] = game.soldiers;
    if (s0 && s1) {
      s0.attackParabolaEffect(s1, activeBullet.value);
    }
  }, [activeBullet]);

  const moveHandle = useCallback(() => {
    // const [s1, s0] = game.soldiers;
    const [s0, s1] = game.soldiers;
    if (s1?.axisPoint && s0) {
      s0.container.angle += Math.PI;
      s0.moveTo(s1.axisPoint);
    }
  }, []);

  const dirHandle = useCallback(() => {
    const [s0, s1] = game.soldiers;
    // s0.container.angle += 180;
    // console.log(s0.container);
    // s0.displaySprite.anchor.x = 1;
    if (s0) {
      s0.displaySprite.scale.x *= -1;
    }
  }, []);

  const [speederBase, setSpeederBase] = useState(speeder.base);

  return (
    <Box position='relative'>
      <Flex>
        <Button onClick={testHandle}>testHandle</Button>
        <Box width={200}>
          <Select
            options={bulletSelect}
            mb='27px'
            defaultId={0}
            onChange={option => {
              setActiveBullet(option);
            }}
          />
        </Box>
        <Button onClick={sendHandle}>发射</Button>
        <Button onClick={moveHandle}>移动</Button>
        <Button onClick={dirHandle}>转向</Button>
      </Flex>
      <Flex>
        <Box mr='80px'>
          <Box mt='50px'>
            <Text>当前星球id</Text>
            <PrimaryInput
              value={pid0}
              onChange={e => {
                setPid0(e.target.value);
              }}
            />
          </Box>
          <Box mt='50px'>
            <Text>对手星球id</Text>
            <PrimaryInput
              value={pid1}
              onChange={e => {
                setPid1(e.target.value);
              }}
            />
          </Box>
          <Box mt='50px'>
            <Text>回合数</Text>
            <PrimaryInput
              value={maxRound}
              onChange={e => {
                setMaxRound(e.target.value);
              }}
            />
          </Box>
          <Box mt='50px'>
            <Button onClick={startHandle}>开始匹配</Button>
            {/* <Button>开始战斗</Button> */}
          </Box>
        </Box>
        <Box>
          <Box ref={ref} />
        </Box>
        <Box ml='20px'>
          <Box>
            <Box mt='50px'>
              <Text>战斗速度</Text>
            </Box>
            <Text>X {speederBase}</Text>
            <Button
              onClick={() => {
                speeder.base /= 2;
                setSpeederBase(speeder.base);
              }}
            >
              减速
            </Button>
            <Button
              onClick={() => {
                speeder.base *= 2;
                setSpeederBase(speeder.base);
              }}
            >
              加速
            </Button>
            <Button
              onClick={() => {
                running?.pause();
              }}
            >
              暂停
            </Button>
            <Button
              onClick={() => {
                running?.play();
              }}
            >
              播放
            </Button>
            <Button
              onClick={() => {
                resetSolider();
                running?.reStart();
              }}
            >
              重置
            </Button>
          </Box>
          <Box mt='50px'>
            <Text>按次数播放(负数为连续播放)</Text>
            <PrimaryInput
              value={runningInfo.playCount}
              onChange={e => {
                setRunningInfo(prev => {
                  return {
                    ...prev,
                    playCount: e.target.value,
                  };
                });
              }}
            />
            <Button
              onClick={() => {
                if (Number(runningInfo.playCount)) {
                  running?.changePlayCount(Number(runningInfo.playCount));
                }
              }}
            >
              播放
            </Button>
          </Box>
          <Box mt='50px'>
            <Text>到某回合并暂停</Text>
            <Select
              options={selectOptions}
              mb='27px'
              defaultId={0}
              onChange={option => {
                selectHandle(option.info, option.id as string);
                // setSelectId(option.value);
              }}
            />
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default React.memo(GamePK);
