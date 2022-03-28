import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Box, Text, Flex } from 'uikit';
import { qualities, QualityProps, MysteryBoxComProps } from './types';
import { mysteryConfig } from './config';

export const BoxStyled = styled(Box)`
  width: 480px;
  height: 620px;
  position: relative;
`;

export const BoxBgStyled = styled(Box)<QualityProps>`
  background: url('/images/mystery-box/b-${({ quality }) => quality}.png');
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 2;
`;

export const BoxBaseStyled = styled(Box)<QualityProps>`
  background: url('/images/mystery-box/base-${({ quality }) => quality}.png');
  position: absolute;
  width: 300px;
  height: 400px;
  bottom: 60px;
  left: 0;
  right: 0;
  margin: auto;
  z-index: 1;
`;

export const BoxBoxStyled = styled(Box)<QualityProps>`
  background: url('/images/mystery-box/box-${({ quality }) => quality}.png');
  position: absolute;
  width: 250px;
  height: 250px;
  top: 130px;
  left: 0;
  right: 0;
  margin: auto;
  z-index: 3;
`;
