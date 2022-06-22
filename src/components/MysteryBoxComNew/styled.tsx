import React, { useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { Box, Text, Flex } from 'uikit';
import { qualities, QualityProps, MysteryBoxComProps } from './types';
import { mysteryConfig } from './config';

export const BoxStyled = styled(Box)`
  width: 480px;
  height: 620px;
  position: relative;
`;

export const BoxBgStyled = styled(Box)<QualityProps>`
  background: ${({ quality }) =>
    `url('/images/mystery-box/b-${mysteryConfig[quality]?.srcName}.png')`};
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 2;
`;

export const BoxBaseStyled = styled(Box)<QualityProps>`
  background: ${({ quality }) =>
    `url('/images/mystery-box/base-${mysteryConfig[quality]?.srcName}.png')`};
  position: absolute;
  width: 400px;
  height: 400px;
  bottom: 60px;
  left: 0;
  right: 0;
  margin: auto;
  z-index: 1;
`;

const move = keyframes`
  0% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-18px) scale(1.05);
  }
  100% {
    transform: translateY(0) scale(1);
  }
`;
export const BoxBoxStyled = styled(Box)<QualityProps>`
  background: ${({ quality }) =>
    `url('/images/mystery-box/box-${mysteryConfig[quality]?.srcName}.png') no-repeat`};
  background-size: 100%;
  position: absolute;
  width: calc(306px * 0.8);
  height: calc(200px * 0.8);
  top: 158px;
  left: 0;
  right: 0;
  margin: auto;
  animation: ${move} 4s infinite;
  z-index: 3;
`;
