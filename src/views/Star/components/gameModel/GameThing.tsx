import React from 'react';
import styled, { css } from 'styled-components';
import { variant } from 'styled-system';
import { Card, Flex, Box, Image, Text } from 'uikit';

const scales = {
  LD: 'ld',
  LG: 'lg',
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
  [scales.LG]: {
    width: 295,
    height: 295,
    text: {
      top: 20,
      left: 28,
      fontSize: 50,
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
  scale: 'ld' | 'lg' | 'md' | 'sm';
  text?: string;
  active?: boolean;
  border?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnter?: (e: React.DragEvent<HTMLDivElement>) => void;
}> = ({
  scale,
  text,
  active,
  border,
  onDragStart,
  onDrop,
  onDragOver,
  onDragEnter,
}) => {
  const sizeBox = scaleVariants[scale];

  return (
    <Flex justifyContent='center' flexDirection='column'>
      <Container
        draggable
        onDragStart={onDragStart}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragEnter={onDragEnter}
        active={active}
        border={border}
      >
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
