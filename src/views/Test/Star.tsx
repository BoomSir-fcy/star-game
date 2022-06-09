import React from 'react';
import { Text, Card, Box, Flex } from 'uikit';
import StarCom from 'components/StarCom';

const TestStar: React.FC = () => {
  return (
    <Box>
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
          <StarCom variant='ring' quality={2} ml='16px' />
        </Box>
        <Box>
          <Text bold color='rare'>
            稀有
          </Text>
          <StarCom quality={3} ml='16px' />
        </Box>
        <Box>
          <Text bold color='epic'>
            史诗
          </Text>
          <StarCom quality={4} ml='16px' />
        </Box>
        <Box>
          <Text bold color='legend'>
            传说
          </Text>
          <StarCom quality={5} ml='16px' />
        </Box>
        <Box>
          <Text bold color='mythology'>
            神话
          </Text>
          <StarCom quality={6} ml='16px' />
        </Box>
      </Flex>
      <Flex flexWrap='wrap' mt='50px'>
        <Box>
          <Text bold color='epic'>
            ld
          </Text>
          <StarCom scale='ld' ml='16px' />
        </Box>
        <Box>
          <Text bold color='epic'>
            md
          </Text>
          <StarCom scale='md' ml='16px' />
        </Box>
        <Box>
          <Text bold color='epic'>
            sm
          </Text>
          <StarCom scale='sm' ml='16px' />
        </Box>
        <Box>
          <Text bold color='epic'>
            xs
          </Text>
          <StarCom scale='xs' ml='16px' />
        </Box>
      </Flex>
    </Box>
  );
};

export default TestStar;
