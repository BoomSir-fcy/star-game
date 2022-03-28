import React from 'react';
import { Box, Text, Flex, BoxProps } from 'uikit';
import { ExtraLabelStyled } from './styled';

const Extra: React.FC<BoxProps> = props => {
  return (
    <Box {...props}>
      <Text mb='10px'>Extra</Text>
      <ExtraLabelStyled>
        <Text>防御加成:</Text>
        <Text>所有建筑防御+10</Text>
      </ExtraLabelStyled>
      <ExtraLabelStyled mt='21px'>
        <Text>防御加成:</Text>
        <Text>所有建筑防御+10</Text>
      </ExtraLabelStyled>
      <ExtraLabelStyled mt='21px'>
        <Text>防御加成:</Text>
        <Text>所有建筑防御+10</Text>
      </ExtraLabelStyled>
      <ExtraLabelStyled mt='21px'>
        <Text>防御加成:</Text>
        <Text>所有建筑防御+10</Text>
      </ExtraLabelStyled>
      <ExtraLabelStyled mt='21px'>
        <Text>防御加成:</Text>
        <Text>所有建筑防御+10</Text>
      </ExtraLabelStyled>
    </Box>
  );
};

export default Extra;
