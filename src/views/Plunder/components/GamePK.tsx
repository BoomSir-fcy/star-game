import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { Box, Button, Flex, Text, PrimaryInput } from 'uikit';
import { Api } from 'apis';
import {
  useFetchGamePlanetUnits,
  useFetchUnitList,
  useFetchGamePK,
} from 'state/game/hooks';
import Soldier from 'game/core/Soldier';
import { useStore } from 'state';
import Game from 'game/core/Game';
import { MapBaseUnits } from 'state/types';
import { RoundInfo, RoundDescMove, RoundDescAttack } from 'game/types';
import useParsedQueryString from 'hooks/useParsedQueryString';
import { fetchUnitListAsync } from 'state/game/reducer';
import { fetchPlanetInfoAsync } from 'state/planet/fetchers';
import { useDispatch } from 'react-redux';
import Running, { RoundsProps } from 'game/core/Running';
import { useNavigate } from 'react-router-dom';

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

  useEffect(() => {
    console.log(PKInfo, 'PKInfo');
    if (PKInfo && game.soldiers.length === 0) {
      createSoldiers(PKInfo.init.blue_units, PKInfo.init.base_unit, false);
      createSoldiers(PKInfo.init.red_units, PKInfo.init.base_unit, true);
      runHandle(PKInfo.slot);
    }
  }, [PKInfo, createSoldiers, runHandle]);

  return (
    <Box position='relative'>
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
        {/* <Box ml='50'>
          <Text>战斗速度</Text>
          <Text>X {running?.rate}</Text>
          <Button
            onClick={() => {
              if (running?.rate) {
                running.rate += running.rate > 1 ? -0.2 : -1;
              }
            }}
          >
            减速
          </Button>
          <Button
            onClick={() => {
              if (running?.rate) {
                running.rate += running.rate > 1 ? 1 : 0.2;
              }
            }}
          >
            加速
          </Button>
        </Box> */}
      </Flex>
    </Box>
  );
};

export default React.memo(GamePK);
