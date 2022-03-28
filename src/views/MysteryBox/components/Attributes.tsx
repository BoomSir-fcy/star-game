import React from 'react';
import { Box, Text, Flex, BoxProps } from 'uikit';
import { LabelStyled } from './styled';

const Attributes: React.FC<BoxProps> = ({ children, ...props }) => {
  return (
    <Box {...props}>
      <Text mb='10px'>Attributes</Text>
      <Flex>
        <LabelStyled>
          <Text>格子:</Text>
          <Text>5*5</Text>
        </LabelStyled>
        <LabelStyled ml='20px'>
          <Text>格子:</Text>
          <Text>5*5</Text>
        </LabelStyled>
      </Flex>
      <Flex mt='21px'>
        <LabelStyled>
          <Text>格子:</Text>
          <Text>5*5</Text>
        </LabelStyled>
        <LabelStyled ml='20px'>
          <Text>格子:</Text>
          <Text>5*5</Text>
        </LabelStyled>
      </Flex>
      <Flex mt='21px'>
        <LabelStyled>
          <Text>格子:</Text>
          <Text>5*5</Text>
        </LabelStyled>
        <LabelStyled ml='20px'>
          <Text>格子:</Text>
          <Text>5*5</Text>
        </LabelStyled>
      </Flex>
      <Flex mt='21px'>
        <LabelStyled>
          <Text>格子:</Text>
          <Text>5*5</Text>
        </LabelStyled>
        <LabelStyled ml='20px'>
          <Text>格子:</Text>
          <Text>5*5</Text>
        </LabelStyled>
      </Flex>
      {children}
    </Box>
  );
};

export default Attributes;
