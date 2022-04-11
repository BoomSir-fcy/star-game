import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { Box, Text, Flex } from 'uikit';
import { Api } from 'apis';
import {
  useFetchGamePlanetUnits,
  useFetchUnitList,
  useFetchGamePK,
} from 'state/game/hooks';
import Soldier from 'game/core/Soldier';
import { useStore } from 'state';
import Game from 'game/core/Game';
import useParsedQueryString from 'hooks/useParsedQueryString';
import PreviewList from './components/PreviewList';
import Preview from './components/Preview';
import SortBoard, { SortSoldier } from './components/SortBoard';

const game = new Game();

const Embattle = () => {
  const parsedQs = useParsedQueryString();
  const planetId = Number(parsedQs.id);

  // const race = Number(parsedQs.race) as Api.Game.race;

  const plantUnits = useStore(p => p.game.plantUnits);

  const planetInfo = useStore(p => p.planet.planetInfo);

  const info = useMemo(() => {
    return planetInfo[planetId];
  }, [planetInfo, planetId]);

  const race = info?.race as Api.Game.race;

  useFetchGamePK();
  useFetchUnitList(race);
  useFetchGamePlanetUnits(planetId);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.appendChild(game.view);
    }
  }, [ref]);

  const [gameSoldiers, setGameSoldiers] = useState<SortSoldier[]>([]);
  const [activeSolider, setActiveSolider] = useState<null | Soldier>(null);

  const setSortSoldiers = useCallback(
    soldiers => {
      const newSoldiers = soldiers?.map((soldier: Soldier, index: number) => {
        return {
          id: `${index}`,
          src: soldier.options?.textureRes,
          soldier,
        };
      });
      if (newSoldiers) {
        setGameSoldiers(newSoldiers);
      }
    },
    [setGameSoldiers],
  );

  const handleUpdate = useCallback(
    async (event: any) => {
      const { soldiers } = event.detail as { soldiers: Soldier[] };
      const units = soldiers.map((item, index) => {
        return {
          pos: {
            x: item?.axisPoint?.chequer?.axisX || 0,
            y: item?.axisPoint?.chequer?.axisY || 0,
          },
          speed: index, // 出手顺序
          unit_id: item.id,
        };
      });

      const res = await Api.GameApi.gameUnitSetting({
        units,
        planet_id: planetId,
      });
      setSortSoldiers(game.soldiers);
      console.log(res);
    },
    [planetId, setSortSoldiers],
  );

  const listenActiveSoldierChange = useCallback((event: any) => {
    const { soldier } = event.detail as { soldier: Soldier };
    setActiveSolider(soldier);
  }, []);

  useEffect(() => {
    game.addEventListener('updateSoldierPosition', handleUpdate);
    game.addEventListener('activeSoldierChange', listenActiveSoldierChange);
    return () => {
      game.removeEventListener('updateSoldierPosition', handleUpdate);
      game.removeEventListener(
        'activeSoldierChange',
        listenActiveSoldierChange,
      );
    };
  }, [handleUpdate]);

  const createSoldiers = useCallback((poses: Api.Game.UnitPlanetPos[]) => {
    poses.forEach(item => {
      game.createSoldier(item.pos.x, item.pos.y, {
        textureRes: '/assets/modal/m0-1.png',
        id: item.base_unit_id,
      });
    });
  }, []);

  useEffect(() => {
    if (plantUnits[planetId] && game.soldiers.length === 0) {
      createSoldiers(plantUnits[planetId]);
      setSortSoldiers(game.soldiers);
      console.log(game);
    }
  }, [plantUnits, planetId, createSoldiers, setSortSoldiers]);

  return (
    <Box position='relative'>
      <Box ref={ref} />
      <Flex
        style={{ userSelect: 'none' }}
        position='absolute'
        top='0'
        left='824px'
      >
        <Preview game={game} />
        <SortBoard
          sortSoldiers={gameSoldiers}
          setSortSoldiers={setSortSoldiers}
        />
      </Flex>
      <Box
        style={{ userSelect: 'none' }}
        position='absolute'
        top='490px'
        left='0'
      >
        <PreviewList race={race} game={game} />
      </Box>
    </Box>
  );
};

export default Embattle;
