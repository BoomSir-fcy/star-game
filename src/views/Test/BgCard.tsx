import React from 'react';
import { Text, BgCard, Box } from 'uikit';

const TestBgCard: React.FC = () => {
  return (
    <Box>
      <BgCard padding='50px'>
        <Text>这是一个卡片</Text>
      </BgCard>
      <BgCard variant='small' />
    </Box>
  );
};

export default TestBgCard;
