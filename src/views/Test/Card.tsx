import React from 'react';
import { Text, Card, Box, GraphicsCard } from 'uikit';

const TestCard: React.FC = () => {
  return (
    <Box>
      {/* <Card padding='50px'>
        <Text>这是一个卡片</Text>
      </Card> */}
      <GraphicsCard radius width='300px' height='300px' />
    </Box>
  );
};

export default TestCard;
