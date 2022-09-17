import React, { ReactNode } from 'react';
import styled from 'styled-components';
import TooltipTrigger from 'components/Tooltip';
import { Text, Card, Box, GraphicsCard, Button } from 'uikit';

const TipBox = styled(Box)`
  width: 150px;
  position: absolute;
  background: #4b4b4b;
  opacity: 0;
  border-radius: 10px;
  padding: 0;
  left: -160px;
  cursor: auto;
  transition: all 0.5s;
  overflow: hidden;
`;

const TipTriangle = styled(Box)`
  width: 0px;
  height: 0px;
  border: 10px solid transparent;
  border-top-color: #4b4b4b;
  position: absolute;
  right: -8px;
  top: 0;
`;

const TestCard: React.FC = () => {
  return (
    <Box>
      {/* <Card padding='50px'>
        <Text>这是一个卡片</Text>
      </Card> */}
      <GraphicsCard
        borderWidth={2}
        isRadius
        stripe
        width='300px'
        height='300px'
      >
        <Text>dddddd</Text>
      </GraphicsCard>

      <TooltipTrigger
        overlay={
          <Box>
            <Text>i am a tooltip</Text>
          </Box>
        }
      >
        <Button>trigger</Button>
      </TooltipTrigger>
    </Box>
  );
};

export default TestCard;
