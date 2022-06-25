import styled, { keyframes } from 'styled-components';
import { Box, Flex } from 'uikit';

const StarMoveFrame = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(2px);
  }
  100% {
    transform: translateY(0px);
  }
`;
const StarScaleFrame = keyframes`
  0% {
    transform: scale(0.8);
  }
  100% {
    transform: scale(1);
  }
`;
export const DragBox = styled(Box)`
  position: relative;
  width: 100%;
  height: 100vh;
  margin: auto;
  border: 5px solid black;
  overflow: auto;

  &.no-select {
    user-select: none;
  }
  ::-webkit-scrollbar {
    width: 0px;
    height: 0px;
  }
`;
export const PlanetBox = styled(Box)`
  position: relative;
  width: 3000px;
  height: 100%;
  border: 5px solid red;
`;
export const GlobeFlex = styled(Flex)`
  width: auto;
  height: 100%;
  transform-style: preserve-3d;
  perspective: 2000px;
  & .star {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    width: 120px;
    height: 120px;
    cursor: pointer;
  }

  // 行星点击效果
  .ball:hover {
    /* transform: scale(0.5); */
    /* transition: transform 0.3s; */
    animation: ${StarScaleFrame} 1s ease-in-out both;
  }

  // 行星外层动画
  .animation {
    /* animation: ${StarMoveFrame} 2s ease-in-out infinite; */
  }
  & .star-0 {
    transform: translate(900px, 135px) translateZ(-100px) scale3d(2, 2, 2);
  }
  & .star-1 {
    transform: translate(331px, 0px) translateZ(-300px) scale3d(1.5, 1.5, 1.5);
  }
  & .star-2 {
    transform: translate(1360px, 0px) translateZ(-300px) scale3d(1.3, 1.3, 1.3);
  }
  & .star-3 {
    transform: translate(460px, -258px) translateZ(-700px)
      scale3d(1.1, 1.1, 1.1);
  }
  & .star-4 {
    transform: translate(950px, -250px) translateZ(-700px) scale3d(1, 1, 1);
  }
  & .star-5 {
    transform: translate(1560px, -250px) translateZ(-900px)
      scale3d(0.9, 0.9, 0.9);
  }
  & .star-6 {
    transform: translate(1860px, 100px) translateZ(-300px)
      scale3d(1.6, 1.6, 1.6);
  }
  & .star-7 {
    transform: translate(2200px, -250px) translateZ(-700px)
      scale3d(1.1, 1.1, 1.1);
  }
  & .star-8 {
    transform: translate(2300px, 140px) translateZ(-100px) scale3d(2, 2, 2);
  }
  & .star-9 {
    transform: translate(2900px, -100px) translateZ(-500px)
      scale3d(1.6, 1.6, 1.6);
  }
`;

// 行星上的数值
export const Desc = styled(Box)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  /* background-color: pink; */
  z-index: 1;
`;

// 左下角的筛选和信息
export const LeftBox = styled(Box)`
  position: fixed;
  left: 0;
  bottom: 0;
`;
