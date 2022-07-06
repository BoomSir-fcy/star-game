import React from 'react';
import styled, { css } from 'styled-components';
import { variant } from 'styled-system';
import { GraphicsCard, Flex, Box, Image, Text, MarkText } from 'uikit';

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
    width: 180,
    height: 180,
    text: {
      top: 5,
      left: 13,
      fontSize: 18,
    },
  },
  [scales.SM]: {
    width: 110,
    height: 110,
    text: {
      top: 5,
      left: 13,
      fontSize: 14,
    },
  },
};

const Container = styled(GraphicsCard)<{
  active?: boolean;
  border?: boolean;
  round?: boolean;
}>`
  cursor: pointer;
  overflow: visible;
  padding: 0;
  ${({ theme, active, border, round }) => {
    if (border) {
      return css`
        border: 1px solid #4ffffb;
      `;
    }
    if (active) {
      return css`
        box-shadow: 0 0 2px 2px rgba(255, 255, 255, 0.8);
      `;
    }
    if (round) {
      return css`
        border-radius: 10px;
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
  round?: boolean;
  draggable?: boolean;
  onClick?: () => void;
  onAddClick?: () => void;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnter?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd?: (e: React.DragEvent<HTMLDivElement>) => void;
  onPointerDown?: (e: React.PointerEvent<HTMLDivElement>) => void;
}> = ({
  scale = scales.SM,
  itemData,
  level,
  src,
  text,
  active,
  border,
  round,
  draggable,
  onClick,
  onAddClick,
  onDragStart,
  onDrop,
  onDragOver,
  onDragEnter,
  onDragEnd,
  onPointerDown,
}) => {
  const sizeBox = scaleVariants[scale];

  return (
    <Flex justifyContent='center' flexDirection='column'>
      <Container
        isRadius
        stripe
        width={`${sizeBox.width}px`}
        height={`${sizeBox.height}px`}
        draggable={draggable}
        onDragStart={onDragStart}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragEnter={onDragEnter}
        onDragEnd={onDragEnd}
        onPointerDown={onPointerDown}
        active={active}
        border={border}
        round={round}
        onClick={onClick}
        data-item={JSON.stringify(itemData)}
      >
        {level && (
          <Level shadow='primary' bold style={sizeBox?.text}>
            Lv {level}
          </Level>
        )}
        {src && (
          <Box
            width={sizeBox.width}
            height={sizeBox.height}
            style={
              round && {
                borderRadius: '10px',
                overflow: 'hidden',
                position: 'relative',
                zIndex: 99,
              }
            }
          >
            <Image width={sizeBox.width} height={sizeBox.height} src={src} />
          </Box>
        )}
        <Box
          zIndex={100}
          width={36}
          height={36}
          position='absolute'
          left='0'
          bottom='0'
          onClick={() => {
            console.log(66666);
            onAddClick();
          }}
        >
          <Image
            style={{ cursor: 'pointer' }}
            // position='absolute'
            // bottom='0'
            // left='0'
            width={36}
            height={36}
            src='/images/commons/icon/add.png'
          />
        </Box>
      </Container>
      {text && (
        <MarkText mt='12px' bold small textAlign='center' fontStyle='normal'>
          {text}
        </MarkText>
      )}
    </Flex>
  );
};

GameThing.defaultProps = {
  scale: scales.SM,
};
