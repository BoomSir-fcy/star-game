import React from 'react';
import { Flex, Box, Progress, Text } from 'uikit';

import { TokenImage } from 'components/TokenImage';

export const BuildingProgress = () => {
  return (
    <Flex flex={1}>
      <TokenImage width={50} height={50} tokenAddress='ORE' />
      <Flex ml='9px' flexDirection='column' flex={1}>
        <Flex width='100%' mb='7px'>
          <Flex justifyContent='space-between' alignItems='center' width='100%'>
            <Flex alignItems='center'>
              <Text color='textSubtle'>矿石</Text>
              <Text ml='12px'>100</Text>
            </Flex>
            <Text color='progressGreenBar'>Next Lv. +100</Text>
          </Flex>
        </Flex>
        <Progress
          color='progressGreenBar'
          variant='round'
          scale='sm'
          linear
          primaryStep={20}
        />
      </Flex>
    </Flex>
  );
};
