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
    width: 240,
    height: 240,
    text: {
      top: 5,
      left: 13,
      fontSize: 40,
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

const Container = styled(Card)<{ active?: boolean; border?: boolean }>`
  cursor: pointer;
  ${({ theme, active, border }) => {
    if (border) {
      return css`
        border: 1px solid #373c45;
        border-radius: theme.radii.card;
      `;
    }
    if (active) {
      return css`
        box-shadow: 0 0 2px 2px rgba(255, 255, 255, 0.8);
      `;
    }
    return css``;
  }}
`;
const Level = styled(Text)`
  position: absolute;
  z-index: 99;
`;

export const GameThing: React.FC<{
  scale: 'ld' | 'md' | 'sm';
  text?: string;
  active?: boolean;
  border?: boolean;
}> = ({ scale, text, active, border }) => {
  const sizeBox = scaleVariants[scale];

  return (
    <Flex justifyContent='center' flexDirection='column'>
      <Container draggable active={active} border={border}>
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
      {text && (
        <Text mt='10' small textAlign='center'>
          {text}
        </Text>
      )}
    </Flex>
  );
};

GameThing.defaultProps = {
  scale: scales.SM,
};
