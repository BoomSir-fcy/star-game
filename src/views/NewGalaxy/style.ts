import React from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { Box, Button, Flex, GraphicsCard, MarkText } from 'uikit';

export const GalaxyBox = styled(Box)`
  position: relative;
  width: 100%;
  height: 940px;
  margin: auto;
  &.no-select {
    user-select: none;
  }
`;

export const GalaxyInfoBox = styled(Flex)`
  position: relative;
  width: 100%;
  height: calc(100% - 160px);
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

export const InfoModuleBox = styled(Box)`
  position: fixed;
  width: 582px;
  height: max-content;
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
  padding: 0;
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
  padding-bottom: 20px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.borderPrimary};
`;

export const ScrollBox = styled(Box)`
  padding-top: 6px;
  height: 80px;
  overflow-y: auto;
`;

export const AuctionBtn = styled(Button)``;

export const TextInfoBox = styled(Box)`
  position: relative;
  width: 240px;
  min-height: 100px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  padding: 10px;
  z-index: 1;
  transform: scale(0.4);
  margin-top: 100px;
`;

export const GalaxyItemInfo = styled(Flex)`
  /* position: relative; */
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  /* top: 50%;
  left: 50%; */
  /* transform: translate(-50%, -50%) scale(0.8); */
`;
export const GalaxyItemInfoTitle = styled(GraphicsCard)`
  position: absolute;
  top: -14px;
  left: 82px;
  width: 80px;
  height: 24px;
  padding: 0;
`;

export const GalaxyImg = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.8);
  height: 220px;
  width: 220px;
  /* animation: box 20s ease-in-out infinite;
  @keyframes box {
    0% {
      transform: translateY(0px) translate(-50%, -50%) scale(0.8);
    }
    50% {
      transform: translateY(-20px) translate(-50%, -50%) scale(0.8);
    }
    100% {
      transform: translateY(0px) translate(-50%, -50%) scale(0.8);
    }
  } */
`;

export const GetImg = styled.img`
  height: 16px;
  width: 20px;
`;
