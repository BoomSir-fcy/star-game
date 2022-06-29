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
`;

export const ItemGalaxyBox = styled(Box)<{ name: string; delay: number }>`
  /* position: absolute; */
  cursor: pointer;
  animation: ${({ name, delay }) =>
    `${name} 20s ease-in-out ${delay}s infinite`};
  @keyframes box0 {
    0% {
      transform: translateX(0px) translateY(0px);
    }
    50% {
      transform: translateX(-40px) translateY(-60px);
    }
    100% {
      transform: translateX(0px) translateY(0px);
    }
  }
  @keyframes box1 {
    0% {
      transform: translateX(0px) translateY(0px);
    }
    50% {
      transform: translateX(60px) translateY(-40px);
    }
    100% {
      transform: translateX(0px) translateY(0px);
    }
  }
  @keyframes box2 {
    0% {
      transform: translateX(0px) translateY(0px);
    }
    25% {
      transform: translateX(-20px) translateY(60px);
    }
    50% {
      transform: translateX(0px) translateY(100px);
    }
    75% {
      transform: translateX(20px) translateY(40px);
    }
    100% {
      transform: translateX(0px) translateY(0px);
    }
  }
  @keyframes box3 {
    0% {
      transform: translateX(0px) translateY(0px);
    }
    25% {
      transform: translateX(30px) translateY(-20px);
    }
    50% {
      transform: translateX(60px) translateY(0px);
    }
    75% {
      transform: translateX(30px) translateY(20px);
    }
    100% {
      transform: translateX(0px) translateY(0px);
    }
  }
`;

export const GalaxyImg = styled.img`
  width: 100%;
`;

export const InfoModuleBox = styled(Box)`
  position: absolute;
  width: 582px;
  height: 500px;
  background: linear-gradient(270deg, #162d37, #0b1c22, #0a161b);
  border: 2px solid ${({ theme }) => theme.colors.borderPrimary};
  left: 0px;
  bottom: 0;
  padding: 20px 22px;
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
