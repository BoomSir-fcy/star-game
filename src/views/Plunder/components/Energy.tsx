import React from 'react';
import styled from 'styled-components';
import { Box, BoxProps, Text, Flex } from 'uikit';

const BoxStyled = styled(Box)`
  width: 240px;
  height: 80px;
  background: url('/images/plunder/energy.png');
  background-size: 100% 100%;
  position: relative;
`;
const FlexStyled = styled(Flex)`
  flex-direction: column;
  align-items: flex-end;
  position: absolute;
  right: 10px;
  top: 10px;
`;

const Energy: React.FC<BoxProps> = ({ ...props }) => {
  return (
    <BoxStyled {...props}>
      <FlexStyled>
        <Text shadow='primary' fontSize='11px'>
          能量
        </Text>
        <Text shadow='primary' fontSize='26px' bold>
          20
        </Text>
      </FlexStyled>
    </BoxStyled>
  );
};

export default Energy;
