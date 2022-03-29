import React from 'react';
import styled from 'styled-components';
import { Box, BoxProps, Text } from 'uikit';

const BoxStyled = styled(Box)`
  width: 468px;
  height: 582px;
  background: url('/images/plunder/bg.png');
  position: relative;
`;
const CardStyled = styled(Box)`
  width: 356px;
  height: 534px;
  background: url('/images/plunder/card.jpg');
  background-size: 100% 100%;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
`;

const PeopleCard: React.FC<BoxProps> = ({ ...props }) => {
  return (
    <BoxStyled {...props}>
      <CardStyled>
        <Text textAlign='center' color='force'>
          盘哥
        </Text>
      </CardStyled>
    </BoxStyled>
  );
};

export default PeopleCard;
