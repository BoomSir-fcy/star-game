import React from 'react';
import styled from 'styled-components';
import { Flex, Box, Text, Image } from 'uikit';

export const PlanetDesc: React.FC<any> = React.memo(() => {
  return (
    <Flex width='100%' flexDirection='column'>
      <Flex justifyContent='space-between' flex={1} margin='14px 0'>
        <Text color='textSubtle' small>
          掠夺速度:100
        </Text>
        <Text color='textSubtle' small>
          建筑数:100
        </Text>
        <Text color='textSubtle' small>
          格子:5x5
        </Text>
      </Flex>
      <Flex justifyContent='space-between' flex={1} mb='24px'>
        <Flex alignItems='center'>
          <Box width={50} height={50} mr='5px'>
            <Image src='/images/commons/icon/ore.png' width={50} height={50} />
          </Box>
          <Flex flexDirection='column' justifyContent='center'>
            <Text color='textTips' small>
              矿石
            </Text>
            <Text small>100</Text>
          </Flex>
        </Flex>
        <Flex alignItems='center'>
          <Box width={50} height={50} mr='5px'>
            <Image
              src='/images/commons/icon/population.png'
              width={50}
              height={50}
            />
          </Box>
          <Flex flexDirection='column' justifyContent='center'>
            <Text color='textTips' small>
              人口
            </Text>
            <Text small>100</Text>
          </Flex>
        </Flex>
        <Flex alignItems='center'>
          <Box width={50} height={50} mr='5px'>
            <Image
              src='/images/commons/icon/energy.png'
              width={50}
              height={50}
            />
          </Box>
          <Flex flexDirection='column' justifyContent='center'>
            <Text color='textTips' small>
              能量
            </Text>
            <Text small>100</Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
});
