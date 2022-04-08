import Boards from 'game/core/Boards';
import React, { useMemo, useState } from 'react';
import { Box, Text, BgCard, Flex, BorderCard } from 'uikit';
import PreviewSoldier from './PreviewSoldier';

interface PreviewListProps {
  boards: Boards;
}
const PreviewList: React.FC<PreviewListProps> = ({ boards }) => {
  const list = useMemo(
    () => Array.from(new Array(2)).map((item, index) => index),
    [],
  );

  return (
    <BgCard variant='long'>
      <Flex flexWrap='wrap' padding='0 28px'>
        {list.map(item => {
          return (
            <Box key={item} margin='49px 20px 0'>
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
                />
              </BorderCard>
              <Text mt='8px' textAlign='center' fontSize='20' bold>
                机甲{item}
              </Text>
            </Box>
          );
        })}
      </Flex>
    </BgCard>
  );
};

export default PreviewList;
