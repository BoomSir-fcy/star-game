import React from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { Box, Button, Flex, MarkText } from 'uikit';

export const GalaxyBox = styled(Box)`
  position: relative;
  width: 100%;
  height: 100vh;
  margin: auto;
  &.no-select {
    user-select: none;
  }
`;

export const GalaxyInfoBox = styled(Flex)`
  position: relative;
  width: 100%;
  height: calc(100vh - 160px);
  margin: auto;
  flex-wrap: wrap;
  &.no-select {
    user-select: none;
  }
  perspective: 1000px;
  perspective-origin: 50% 20%;
  /* z-index: 0; */
  /* position: relative;
  transform-style: preserve-3d; */
`;

export const ItemGalaxyBox = styled(Box)`
  cursor: pointer;
  position: absolute;
`;

export const GalaxyImg = styled.img`
  width: 100%;
  animation: box 20s ease-in-out infinite;
  @keyframes box {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-20px);
    }
    100% {
      transform: translateY(0px);
    }
  }
`;

export const InfoModuleBox = styled(Box)`
  position: absolute;
  width: 582px;
  height: 500px;
  background: linear-gradient(270deg, #162d37, #0b1c22, #0a161b);
  border: 2px solid ${({ theme }) => theme.colors.borderPrimary};
  bottom: 0;
  padding: 20px 22px;
  opacity: 0;
  transition: all 0.5s ease;
  left: -582px;
  &.Show {
    opacity: 1;
    left: 0;
    animation: ShowDom 1s cubic-bezier(0.215, 0.61, 0.355, 1) 0s 1 alternate
      forwards;
  }
  @keyframes ShowDom {
    0% {
      transform: translate(-200px, 0);
    }
    100% {
      transform: translate(0, 0);
    }
  }
`;

export const NormalMarkText = styled(MarkText)`
  font-style: normal;
`;

export const CloseImg = styled.img`
  width: 32px;
  height: 32px;
  cursor: pointer;
`;

export const UserImg = styled.img`
  width: 65px;
  height: 64px;
`;

export const BorderBox = styled(Box)`
  padding-bottom: 10px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.borderPrimary};
`;

export const ScrollBox = styled(Box)`
  padding-top: 6px;
  height: 80px;
  overflow-y: auto;
`;

export const AuctionBtn = styled(Button)``;
