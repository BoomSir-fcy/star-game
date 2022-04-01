import React from 'react';
import { Flex, Box, Text, Image } from 'uikit';

export const PlanetDesc: React.FC<{
  info: Api.Planet.PlanetInfo;
}> = React.memo(({ info }) => {
  return (
    <Flex width='100%' flexDirection='column'>
      <Flex flex={1} margin='3px 0'>
        <Text color='textSubtle' small>
          掠夺速度:{info?.plunder_speed}
        </Text>
        <Text color='textSubtle' ml='140px' small>
          建筑数:{info?.build_count}
        </Text>
      </Flex>
      <Flex justifyContent='space-between' flex={1}>
        <Flex alignItems='center'>
          <Box width={50} height={50} mr='5px'>
            <Image src='/images/commons/icon/ore.png' width={50} height={50} />
          </Box>
          <Flex flexDirection='column' justifyContent='center'>
            <Text color='textTips' small>
              矿石
            </Text>
            <Text small>{info?.stone}</Text>
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
            <Text small>{info?.population}</Text>
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
            <Text small>{info?.energy}</Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
});
