import React from 'react';
import { Text, Card, Box, GraphicsCard } from 'uikit';

const TestCard: React.FC = () => {
  return (
    <Box>
      {/* <Card padding='50px'>
        <Text>这是一个卡片</Text>
      </Card> */}
      <GraphicsCard borderWidth={2} radius stripe width='300px' height='300px'>
        <Text>dddddd</Text>
      </GraphicsCard>
    </Box>
  );
};

export default TestCard;
