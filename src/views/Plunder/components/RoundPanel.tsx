import React from 'react';
import styled from 'styled-components';
import { Box, BoxProps, Text, Flex, Button } from 'uikit';

const BoxStyled = styled(Box)`
  width: 281px;
  height: 204px;
  background: url('/images/plunder/round.png');
  background-size: 100% 100%;
  position: relative;
`;
const FlexStyled = styled(Flex)`
  flex-direction: column;
  align-items: center;
  position: absolute;
  right: 0;
  top: auto;
  left: 0;
  bottom: 0;
  margin: auto;
`;
const ButtonStyled = styled(Button).attrs({ variant: 'vs' })`
  width: 160px;
  height: 51px;
`;

interface RoundPanelProps extends BoxProps {
  roundName?: string;
}

const RoundPanel: React.FC<RoundPanelProps> = ({ roundName, ...props }) => {
  return (
    <BoxStyled {...props}>
      <FlexStyled>
        <Text shadow='primary' fontSize='24px' bold>
          {roundName || '--'}
        </Text>
        <Text shadow='primary' fontSize='22px' bold>
          我方行动
        </Text>
        <ButtonStyled mt='26px'>
          <Text shadow='primary' small bold>
            结束回合
          </Text>
        </ButtonStyled>
      </FlexStyled>
    </BoxStyled>
  );
};

export default RoundPanel;
