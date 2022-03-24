import React from 'react';
import { Text, Card, Box, Flex } from 'uikit';
import StarCom from 'components/StarCom';

const TestStar: React.FC = () => {
  return (
    <Flex flexWrap='wrap'>
      <Box>
        <Text bold color='ordinary'>
          普通
        </Text>
        <StarCom ml='16px' />
      </Box>
      <Box>
        <Text bold color='good'>
          良好
        </Text>
        <StarCom variant='ring' quality='good' ml='16px' />
      </Box>
      <Box>
        <Text bold color='rare'>
          稀有
        </Text>
        <StarCom quality='rare' ml='16px' />
      </Box>
      <Box>
        <Text bold color='epic'>
          史诗
        </Text>
        <StarCom quality='epic' ml='16px' />
      </Box>
      <Box>
        <Text bold color='legend'>
          传说
        </Text>
        <StarCom quality='legend' ml='16px' />
      </Box>
      <Box>
        <Text bold color='mythology'>
          神话
        </Text>
        <StarCom quality='mythology' ml='16px' />
      </Box>
    </Flex>
  );
};

export default TestStar;
