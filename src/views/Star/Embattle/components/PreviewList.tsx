import Boards from 'game/core/Boards';
import React, { useMemo, useState } from 'react';
import { useStore } from 'state';
import { Box, Text, BgCard, Flex, BorderCard } from 'uikit';
import PreviewSoldier from './PreviewSoldier';

interface PreviewListProps {
  boards: Boards;
  race?: Api.Game.race;
}
const PreviewList: React.FC<PreviewListProps> = ({ boards, race = 1 }) => {
  const units = useStore(p => p.game.baseUnits);

  console.log(units);
  const list = useMemo(() => {
    if (units[race]) return units[race] as unknown as Api.Game.UnitInfo[];
    return [];
  }, [units, race]);

  return (
    <BgCard variant='long'>
      <Flex flexWrap='wrap' padding='0 28px'>
        {list.map(item => {
          return (
            <Box key={item.unique_id} margin='49px 20px 0'>
              <BorderCard
                isActive
                width={122}
                height={122}
                borderWidth={2}
                borderRadius='10px'
                position='relative'
              >
                <Text shadow='primary' fontSize='22' ml='13px' mt='2px' bold>
                  LV 1
                </Text>
                <PreviewSoldier
                  boards={boards}
                  position='absolute'
                  top='0'
                  left='0'
                  sid={item.unique_id}
                />
              </BorderCard>
              <Text mt='8px' textAlign='center' fontSize='20' bold>
                机甲{item.unique_id}
              </Text>
            </Box>
          );
        })}
      </Flex>
    </BgCard>
  );
};

export default PreviewList;
