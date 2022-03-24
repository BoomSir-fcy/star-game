import React from 'react';
import { Text, BgCard, Box, Flex } from 'uikit';

const TestBgCard: React.FC = () => {
  return (
    <Box>
      <BgCard fringe padding='50px'>
        <Text>这是一个卡片</Text>
      </BgCard>
      <Flex>
        <BgCard fringe variant='small' />
        <BgCard variant='small' />
      </Flex>
    </Box>
  );
};

export default TestBgCard;
