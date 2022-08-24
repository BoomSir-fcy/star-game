import React from 'react';
import { Box, BoxProps, Image } from 'uikit';
import styled from 'styled-components';

const TokenAnimationBox = styled(Box)<{ scale: number }>`
  position: fixed;
  z-index: 999;
  transform: ${({ scale }) => `scale(${scale})`};
`;

const CoinImg = styled.img`
  width: 30px;
  height: 30px;
`;

export interface TokenMoveAnimationProps {
  url?: string;
  scale?: number;
}

const TokenMoveAnimation: React.FC<TokenMoveAnimationProps> = ({ scale }) => {
  return (
    <TokenAnimationBox scale={scale}>
      <CoinImg src='/images/tokens/BOX.svg' />
    </TokenAnimationBox>
  );
};

export default TokenMoveAnimation;
