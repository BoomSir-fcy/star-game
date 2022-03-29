import styled, { keyframes } from 'styled-components';
import { Box, Flex, Text } from 'uikit';

const frontFlipDown = keyframes` 
  0% {
    transform: perspective(160px) rotateX(0deg);
  }

  100% {
    transform: perspective(160px) rotateX(-180deg);
  }
`;

const backFlipDown = keyframes`
  0% {
    transform: perspective(160px) rotateX(180deg);
  }

  100% {
    transform: perspective(160px) rotateX(0deg);
  }
`;

export const TimeFlex = styled(Flex)`
  position: relative;
  align-items: center;
`;
export const Colon = styled(Text).attrs({ bold: true })`
  margin: 0 15px;
  font-size: 25px;
`;

const DigitalAll = `
  content: '';
  width: 54px;
  height: 35px;
  line-height: 35px;
  display: block;
  background: url('/images/commons/btn/download-time.png') no-repeat;
  background-size: 327px 159px;
  `;

export const FlipBox = styled.div`
  width: 54px;
  height: 71px;
  line-height: 71px;
  & .number-0::before {
    ${DigitalAll}
    background-position: -265px -82px;
  }
  & .number-0::after {
    ${DigitalAll}
    background-position: -265px -115px;
  }
  & .number-1::before {
    ${DigitalAll}
    background-position: -10px -6px;
  }
  & .number-1::after {
    ${DigitalAll}
    background-position: -10px -40px;
  }
  & .number-2::before {
    ${DigitalAll}
    background-position: -73px -6px;
  }
  & .number-2::after {
    ${DigitalAll}
    background-position: -73px -40px;
  }
  & .number-3::before {
    ${DigitalAll}
    background-position: -137px -6px;
  }
  & .number-3::after {
    ${DigitalAll}
    background-position: -137px -40px;
  }
  & .number-4::before {
    ${DigitalAll}
    background-position: -201px -6px;
  }
  & .number-4::after {
    ${DigitalAll}
    background-position: -201px -40px;
  }
  & .number-5::before {
    ${DigitalAll}
    background-position: -265px -6px;
  }
  & .number-5::after {
    ${DigitalAll}
    background-position: -265px -40px;
  }
  & .number-6::before {
    ${DigitalAll}
    background-position: -10px -82px;
  }
  & .number-6::after {
    ${DigitalAll}
    background-position: -10px -115px;
  }
  & .number-7::before {
    ${DigitalAll}
    background-position: -74px -82px;
  }
  & .number-7::after {
    ${DigitalAll}
    background-position: -74px -115px;
  }
  & .number-8::before {
    ${DigitalAll}
    background-position: -138px -82px;
  }
  & .number-8::after {
    ${DigitalAll}
    background-position: -138px -115px;
  }
  & .number-9::before {
    ${DigitalAll}
    background-position: -202px -82px;
  }
  & .number-9::after {
    ${DigitalAll}
    background-position: -202px -115px;
  }
`;

const Digital = styled.div`
  ::before {
    position: absolute;
    top: 2px;
    bottom: 50%;
  }
  ::after {
    position: absolute;
    top: 50%;
    bottom: 0;
  }
`;

// 向下翻动
// 前牌
export const DigitalFront = styled(Digital)`
  ::before {
    z-index: 3;
  }
  ::after {
    z-index: 1;
  }
  &.go::before {
    transform-origin: 50% 100%;
    animation: ${frontFlipDown} 0.6s ease-in-out both;
    backface-visibility: hidden;
  }
`;

// 后牌
export const DigitalBack = styled(Digital)`
  ::after {
    z-index: 2;
    transform-origin: 50% 0%;
    transform: perspective(160px) rotateX(180deg);
  }
  ::before {
    z-index: 1;
  }
  &.go::after {
    animation: ${backFlipDown} 0.6s ease-in-out both;
  }
`;
