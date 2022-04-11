import React, { useState, useRef, useEffect, useCallback } from 'react';
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
import SortBoard from './components/SortBoard';

const game = new Game();

const Embattle = () => {
  const parsedQs = useParsedQueryString();
  const planetId = Number(parsedQs.id);

  const plantUnits = useStore(p => p.game.plantUnits);

  useFetchGamePK();
  useFetchUnitList();
  useFetchGamePlanetUnits(planetId);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.appendChild(game.view);
    }
  }, [ref]);

  const [gameSoldiers, setGameSoldiers] = useState<Soldier[]>([]);
  const [activeSolider, setActiveSolider] = useState<null | Soldier>(null);

  const handleUpdate = useCallback(
    async (soldiers: Soldier[]) => {
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
      setGameSoldiers(game.soldiers);
      console.log(res);
    },
    [planetId, console],
  );

  useEffect(() => {
    game.addEventListener('updateSoldierPosition', (event: any) => {
      handleUpdate(event.detail.soldiers);
    });
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
      setGameSoldiers(game.soldiers);
      console.log(game);
    }
  }, [plantUnits, planetId, createSoldiers, setGameSoldiers]);

  return (
    <Box position='relative'>
      <Box ref={ref} />
      <Flex
        style={{ userSelect: 'none' }}
        position='absolute'
        top='0'
        left='824px'
      >
        <Preview solider={activeSolider} />
        <SortBoard soldiers={gameSoldiers} ml='8px' />
      </Flex>
      <Box
        style={{ userSelect: 'none' }}
        position='absolute'
        top='490px'
        left='0'
      >
        <PreviewList game={game} />
      </Box>
    </Box>
  );
};

export default Embattle;
