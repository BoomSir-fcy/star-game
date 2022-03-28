import React from 'react';
import styled from 'styled-components';
import { Box, Text, Flex, BoxProps, Label, Image } from 'uikit';

export const ExtraLabelStyled = styled(Label)`
  width: 592px;
  height: 80px;
  padding-left: 44px;
`;

const Extra: React.FC<BoxProps> = props => {
  return (
    <Box {...props}>
      <ExtraLabelStyled justifyContent='space-between'>
        <Flex>
          <Text fontSize='22px'>防御加成:</Text>
          <Text fontSize='22px'>所有建筑防御+10</Text>
        </Flex>
        <Flex width={100}>
          <Image width={33} height={33} src='/images/commons/icon/up.png' />
          <Text fontSize='22px' color='up'>
            +10
          </Text>
        </Flex>
      </ExtraLabelStyled>
      <ExtraLabelStyled justifyContent='space-between' mt='21px'>
        <Flex>
          <Text fontSize='22px'>防御加成:</Text>
          <Text fontSize='22px'>所有建筑防御+10</Text>
        </Flex>
        <Flex width={100}>
          <Image width={33} height={33} src='/images/commons/icon/up.png' />
          <Text fontSize='22px' color='up'>
            +10
          </Text>
        </Flex>
      </ExtraLabelStyled>
      <ExtraLabelStyled justifyContent='space-between' mt='21px'>
        <Flex>
          <Text fontSize='22px'>防御加成:</Text>
          <Text fontSize='22px'>所有建筑防御+10</Text>
        </Flex>
        <Flex width={100}>
          <Image width={33} height={33} src='/images/commons/icon/up.png' />
          <Text fontSize='22px' color='up'>
            +10
          </Text>
        </Flex>
      </ExtraLabelStyled>
      <ExtraLabelStyled justifyContent='space-between' mt='21px'>
        <Flex>
          <Text fontSize='22px'>防御加成:</Text>
          <Text fontSize='22px'>所有建筑防御+10</Text>
        </Flex>
        <Flex width={100}>
          <Image width={33} height={33} src='/images/commons/icon/up.png' />
          <Text fontSize='22px' color='up'>
            +10
          </Text>
        </Flex>
      </ExtraLabelStyled>
      <ExtraLabelStyled justifyContent='space-between' mt='21px'>
        <Flex>
          <Text fontSize='22px'>防御加成:</Text>
          <Text fontSize='22px'>所有建筑防御+10</Text>
        </Flex>
        <Flex width={100}>
          <Image width={33} height={33} src='/images/commons/icon/up.png' />
          <Text fontSize='22px' color='up'>
            +10
          </Text>
        </Flex>
      </ExtraLabelStyled>
    </Box>
  );
};

export default Extra;
