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

export type Scale = typeof scales[keyof typeof scales];

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
  div {
    pointer-events: none;
  }
`;
const Level = styled(Text)`
  position: absolute;
  z-index: 99;
`;

export const GameThing: React.FC<{
  scale?: Scale;
  itemData?: Api.Building.Building;
  src?: string;
  level?: number;
  text?: string;
  active?: boolean;
  border?: boolean;
  draggable?: boolean;
  onClick?: () => void;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnter?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd?: (e: React.DragEvent<HTMLDivElement>) => void;
}> = ({
  scale = scales.SM,
  itemData,
  level,
  src,
  text,
  active,
  border,
  draggable,
  onClick,
  onDragStart,
  onDrop,
  onDragOver,
  onDragEnter,
  onDragEnd,
}) => {
  const sizeBox = scaleVariants[scale];

  return (
    <Flex justifyContent='center' flexDirection='column'>
      <Container
        draggable={draggable}
        onDragStart={onDragStart}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragEnter={onDragEnter}
        onDragEnd={onDragEnd}
        active={active}
        border={border}
        onClick={onClick}
        data-item={JSON.stringify(itemData)}
      >
        {level && (
          <Level shadow='primary' style={sizeBox?.text}>
            Lv {level}
          </Level>
        )}
        {src && (
          <Box width={sizeBox.width} height={sizeBox.height}>
            <Image width={sizeBox.width} height={sizeBox.height} src={src} />
          </Box>
        )}
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
