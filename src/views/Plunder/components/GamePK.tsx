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
} from 'state/game/hooks';
import Soldier from 'game/core/Soldier';
import { useStore } from 'state';
import Game from 'game/core/Game';
import { MapBaseUnits, RoundInitState } from 'state/types';
import { RoundInfo, RoundDescMove, RoundDescAttack } from 'game/types';
import useParsedQueryString from 'hooks/useParsedQueryString';
import { fetchUnitListAsync } from 'state/game/reducer';
import { fetchPlanetInfoAsync } from 'state/planet/fetchers';
import { useDispatch } from 'react-redux';
import Running, { RoundsProps } from 'game/core/Running';
import { useNavigate } from 'react-router-dom';
import { OptionProps, Select } from 'components/Select';

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
const game = new Game({ width: 900, height: 600 });

const GamePK: React.FC<GamePKProps> = () => {
  const [running, setRunning] = useState<Running | null>(null);
  const PKInfo = useStore(p => p.game.PKInfo);

  const navigate = useNavigate();

  const parsedQs = useParsedQueryString();
  const units = useStore(p => p.game.baseUnits);
  const dispatch = useDispatch();

  const [pid0, setPid0] = useState((parsedQs.pid0 as string) || '');
  const [pid1, setPid1] = useState((parsedQs.pid1 as string) || '');
  const [maxRound, setMaxRound] = useState('10');

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

  const startHandle = useCallback(() => {
    if (Number(pid0) && Number(pid1)) {
      dispatch(fetchPlanetInfoAsync([Number(pid0), Number(pid1)]));
      navigate(`/plunder-test?pid0=${pid0}&pid1=${pid1}`, { replace: true });
    }
  }, [dispatch, pid0, pid1]);

  useFetchGamePK(infoP0?.id, infoP1?.id, Number(maxRound));

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.appendChild(game.view);
    }
  }, [ref]);

  const createSoldiers = useCallback(
    (poses: Api.Game.UnitPlanetPos[], base: MapBaseUnits, isEnemy: boolean) => {
      poses?.forEach(item => {
        game.createSoldier(item.pos.x, item.pos.y, {
          textureRes: '/assets/modal/m0-1.png',
          id: item.base_unit_id,
          hp: base[item.base_unit_id].hp,
          isEnemy,
          enableDrag: false,
          unique_id: item.base_unit_id,
          // attackId: base[item.base_unit_id].unique_id
        });
      });
    },
    [],
  );

  const runHandle = useCallback(
    (slot: RoundsProps) => {
      const _running = new Running(game, slot);
      setRunning(_running);
    },
    [setRunning],
  );

  const [selectOptions, setSelectOptions] = useState<OptionProps[]>([]);

  useEffect(() => {
    console.log(PKInfo, 'PKInfo');
    if (PKInfo && game.soldiers.length === 0) {
      createSoldiers(PKInfo.init.blue_units, PKInfo.init.base_unit, false);
      createSoldiers(PKInfo.init.red_units, PKInfo.init.base_unit, true);
      runHandle(PKInfo.slot);
      const res: OptionProps[] = [];
      console.log(PKInfo.status.status);
      Object.keys(PKInfo.status.status).forEach((item: string) => {
        res.push({
          value: `回合${item}`,
          label: `回合${item}`,
          info: PKInfo.status.status[item],
          id: `${item}-0`,
        });
      });
      setSelectOptions(res);
    }
  }, [PKInfo, createSoldiers, runHandle, setSelectOptions]);

  const resetSolider = useCallback(() => {
    game.clearSoldier();

    if (PKInfo && game.soldiers.length === 0) {
      createSoldiers(PKInfo.init.blue_units, PKInfo.init.base_unit, false);
      createSoldiers(PKInfo.init.red_units, PKInfo.init.base_unit, true);
      // runHandle(PKInfo.slot);
    }
  }, [game, PKInfo]);

  const [runningInfo, setRunningInfo] = useState<{
    rate: number;
    playCount: string;
  }>({
    rate: 1,
    playCount: '-1',
  });

  const selectHandle = useCallback(
    (info: RoundInitState[], id: string) => {
      running?.pause();

      game.clearSoldier();
      info.forEach(item => {
        game.createSoldier(item.pos.x, item.pos.y, {
          textureRes: '/assets/modal/m0-1.png',
          id: item.base_id,
          hp: PKInfo?.init.base_unit[item.base_id].hp,
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
    game.createSoldier(0, 7, {
      textureRes: '/assets/modal/m0-1.png',
      id: 1,
      unique_id: 1,
      hp: 100,
      isEnemy: false,
      enableDrag: true,
    });
    game.createSoldier(7, 7, {
      textureRes: '/assets/modal/m0-1.png',
      id: 1,
      unique_id: 1,
      hp: 100,
      isEnemy: true,
      enableDrag: true,
    });
  }, []);

  const sendHandle = useCallback(() => {
    // const [s1, s0] = game.soldiers;
    const [s0, s1] = game.soldiers;
    s0.attackParabola(s1, 4);
  }, []);

  const moveHandle = useCallback(() => {
    // const [s1, s0] = game.soldiers;
    const [s0, s1] = game.soldiers;
    if (s1.axisPoint) {
      s0.run();
      s0.container.angle += Math.PI;
      s0.moveTo(s1.axisPoint);
    }
  }, []);

  const dirHandle = useCallback(() => {
    const [s0, s1] = game.soldiers;
    // s0.container.angle += 180;
    // console.log(s0.container);
    // s0.displaySprite.anchor.x = 1;
    s0.displaySprite.scale.x *= -1;
  }, []);

  return (
    <Box position='relative'>
      <Button onClick={testHandle}>testHandle</Button>
      <Button onClick={sendHandle}>发射</Button>
      <Button onClick={moveHandle}>移动</Button>
      <Button onClick={dirHandle}>转向</Button>
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
        <Box ref={ref} />
        <Box ml='20px'>
          <Box>
            <Text>战斗速度</Text>
            <Text>X {running?.rate}</Text>
            <Button
              onClick={() => {
                if (running?.rate) {
                  running.rate += running.rate > 1 ? -0.2 : -1;
                  setRunningInfo(prev => {
                    return {
                      ...prev,
                      rate: running.rate,
                    };
                  });
                }
              }}
            >
              减速
            </Button>
            <Button
              onClick={() => {
                if (running?.rate) {
                  running.rate += running.rate > 1 ? 1 : 0.2;
                  setRunningInfo(prev => {
                    return {
                      ...prev,
                      rate: running.rate,
                    };
                  });
                }
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
                console.log(option);
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
