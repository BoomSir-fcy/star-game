import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Box, Text, Flex } from 'uikit';
import { Api } from 'apis';
import { useFetchGamePlanetUnits, useFetchUnitList } from 'state/game/hooks';
import Soldier from 'game/core/Soldier';
import Boards from 'game/core/Boards';
import useParsedQueryString from 'hooks/useParsedQueryString';
import PreviewList from './components/PreviewList';
import Preview from './components/Preview';
import SortBoard from './components/SortBoard';

const Embattle = () => {
  const [boards] = useState(new Boards());

  const parsedQs = useParsedQueryString();
  const planetId = Number(parsedQs.id);

  useFetchUnitList();
  useFetchGamePlanetUnits(planetId);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.appendChild(boards.app?.view);
    }
  }, [ref, boards]);

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
    boards.addEventListener('updateSoldierPosition', (event: any) => {
      handleUpdate(event.detail.soldiers);
    });
  }, [boards, handleUpdate]);

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
        <PreviewList boards={boards} />
      </Box>
    </Box>
  );
};

export default Embattle;
