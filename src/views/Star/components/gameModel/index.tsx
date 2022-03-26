import React from 'react';
import styled, { css } from 'styled-components';
import { variant } from 'styled-system';
import { Card, Flex, Box, Image, Text } from 'uikit';

const scales = {
  LD: 'ld',
  MD: 'md',
  SM: 'sm',
} as const;

const scaleVariants = {
  [scales.LD]: {
    width: 316,
    height: 316,
    text: {
      top: 5,
      left: 13,
      fontSize: 20,
    },
  },
  [scales.MD]: {
    width: 158,
    height: 158,
    text: {
      top: 5,
      left: 13,
      fontSize: 20,
    },
  },
  [scales.SM]: {
    width: 108,
    height: 108,
    text: {
      top: 5,
      left: 13,
      fontSize: 20,
    },
  },
};

const Container = styled(Card)<{ active?: boolean }>`
  cursor: pointer;
  ${({ active }) =>
    active &&
    css`
      box-shadow: 0 0 2px 2px rgba(255, 255, 255, 0.8);
    `}
`;
const Level = styled(Text)`
  position: absolute;
  z-index: 99;
`;

export const GameModal: React.FC<{
  scale: 'ld' | 'md' | 'sm';
}> = ({ scale }) => {
  const sizeBox = scaleVariants[scale];

  return (
    <Flex justifyContent='center' flexDirection='column'>
      <Container draggable active>
        <Level shadow='primary' style={sizeBox?.text}>
          Lv 1
        </Level>
        <Box width={sizeBox.width} height={sizeBox.height}>
          <Image
            width={sizeBox.width}
            height={sizeBox.height}
            src='/images/model/combat_01.png'
          />
        </Box>
      </Container>
      <Text mt='10' small textAlign='center'>
        防空塔
      </Text>
    </Flex>
  );
};

GameModal.defaultProps = {
  scale: scales.SM,
};
