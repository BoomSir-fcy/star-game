import React from 'react';
import { Flex, Box, MarkText, Text, Button } from 'uikit';

import { BuildingProgress } from './buildingProgress';

export const BuildingResources: React.FC<{
  currnet_building: Api.Building.BuildingDetail;
}> = ({ currnet_building }) => {
  return (
    <Box>
      <MarkText bold fontSize='18px' fontStyle='normal' mb='25px'>
        储存资源
      </MarkText>
      <Flex width='100%' flexDirection='column'>
        <Box mb='20px'>
          <BuildingProgress />
        </Box>
        <Box mb='20px'>
          <BuildingProgress />
        </Box>
        <Box mb='20px'>
          <BuildingProgress />
        </Box>
      </Flex>
      <Flex justifyContent='space-between'>
        <Button width='226px' height='53px' variant='purple'>
          <Text bold fontSize='16px' color='#4FFFFB'>
            补充资源
          </Text>
        </Button>
        <Button width='226px' height='53px' variant='purple'>
          <Text bold fontSize='16px' color='#4FFFFB'>
            提取资源
          </Text>
        </Button>
      </Flex>
    </Box>
  );
};
