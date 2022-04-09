import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Box, Text, Flex } from 'uikit';
import { Api } from 'apis';
import { useFetchGamePlanetUnits, useFetchUnitList } from 'state/game/hooks';
import Soldier from 'game/core/Soldier';
import { useStore } from 'state';
import Game from 'game/core/Game';
import useParsedQueryString from 'hooks/useParsedQueryString';
import PreviewList from './components/PreviewList';
import Preview from './components/Preview';
import SortBoard from './components/SortBoard';

const Embattle = () => {
  const [game] = useState(new Game());

  const parsedQs = useParsedQueryString();
  const planetId = Number(parsedQs.id);

  const plantUnits = useStore(p => p.game.plantUnits);

  console.log(plantUnits, 'plantUnits');

  useFetchUnitList();
  useFetchGamePlanetUnits(planetId);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.appendChild(game.view);
    }
  }, [ref, game]);

  const handleUpdate = useCallback(
    async (soldiers: Soldier[]) => {
      console.log(soldiers);
      const units = soldiers.map((item, index) => {
        return {
          pos: {
            x: item.chequer?.axisX || 0,
            y: item.chequer?.axisY || 0,
          },
          speed: index, // 出手顺序
          unit_id: item.id,
        };
      });

      const res = await Api.GameApi.gameUnitSetting({
        units,
        planet_id: planetId,
      });

      console.log(res);
    },
    [planetId],
  );

  useEffect(() => {
    game.addEventListener('updateSoldierPosition', (event: any) => {
      handleUpdate(event.detail.soldiers);
    });
  }, [game, handleUpdate]);

  const createSoldiers = useCallback(
    (poses: Api.Game.UnitPlanetPos[]) => {
      console.log(12121212);
      poses.forEach(item => {
        console.log(444444);
        game.createSoldier(item.pos.x, item.pos.y, {
          textureRes: '/assets/flowerTop.png',
          id: item.base_unit_id,
        });
      });
    },
    [game],
  );

  useEffect(() => {
    console.log(
      plantUnits[planetId],
      game.soldiers.length === 0,
      '=weijqwjeoqwienqwleul ',
    );
    if (plantUnits[planetId] && game.soldiers.length === 0) {
      createSoldiers(plantUnits[planetId]);
    }
  }, [plantUnits, planetId, game.soldiers, createSoldiers]);

  return (
    <Box position='relative'>
      <Box ref={ref} />
      <Flex
        style={{ userSelect: 'none' }}
        position='absolute'
        top='0'
        left='824px'
      >
        <Preview />
        <SortBoard ml='8px' />
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
