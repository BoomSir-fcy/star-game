import React from 'react';
import { Text, Box, Flex } from 'uikit';

const TestText: React.FC = () => {
  return (
    <Box>
      <Box>
        <Text>text shadows</Text>
      </Box>
      <Flex>
        <Text mr='16px' shadow='primary'>
          primary
        </Text>
        <Text mr='16px' shadow='secondary'>
          secondary
        </Text>
        <Text mr='16px' shadow='tertiary'>
          tertiary
        </Text>
      </Flex>
      <Box mt='16px'>
        <Text>text size</Text>
      </Box>
      <Flex>
        <Text mr='16px'>default</Text>
        <Text mr='16px' small>
          small
        </Text>
        <Text mr='16px' bold>
          bold
        </Text>
      </Flex>
    </Box>
  );
};

export default TestText;
