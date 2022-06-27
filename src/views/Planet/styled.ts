import React from 'react';
import { Link } from 'react-router-dom';
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
    transform: scale(1);
  }
  100% {
    transform: scale(1.5);
  }
`;
export const DragBox = styled(Box)`
  position: relative;
  width: 100%;
  height: 100vh;
  margin: auto;
  /* border: 5px solid black; */
  overflow: auto;

  &.no-select {
    user-select: none;
  }
  ::-webkit-scrollbar {
    height: 12px;
  }
  ::-webkit-scrollbar-thumb {
    /* background: ${({ theme }) => theme.colors.textSubtle}; */
    background: rgb(75 75 75 / 50%);
    border-radius: 20px;
  }
`;
export const PlanetBox = styled(Box)`
  position: relative;
  width: 3000px;
  height: 100%;
  /* border: 5px solid red; */
`;

const SCREEN_WIDTH = 3000;

const position = [
  {
    index: 0,
    x: 900,
    y: 135,
    z: -100,
    scale3d: '2, 2, 2',
  },
  {
    index: 1,
    x: 331,
    y: 0,
    z: -300,
    scale3d: '1.5, 1.5, 1.5',
  },
  {
    index: 2,
    x: 1360,
    y: 0,
    z: -300,
    scale3d: '1.3, 1.3, 1.3',
  },
  {
    index: 3,
    x: 460,
    y: -258,
    z: -700,
    scale3d: '1.1, 1.1, 1.1',
  },
  {
    index: 4,
    x: 950,
    y: -250,
    z: -700,
    scale3d: '1, 1, 1',
  },
  {
    index: 5,
    x: 1560,
    y: -250,
    z: -900,
    scale3d: '0.9, 0.9, 0.9',
  },
  {
    index: 6,
    x: 1860,
    y: 100,
    z: -300,
    scale3d: '1.6, 1.6, 1.6',
  },
  {
    index: 7,
    x: 2200,
    y: -250,
    z: -700,
    scale3d: '1.1, 1.1, 1.1',
  },
  {
    index: 8,
    x: 2300,
    y: 140,
    z: -100,
    scale3d: '2, 2, 2',
  },
  {
    index: 9,
    x: 2800,
    y: -100,
    z: -500,
    scale3d: '1.6, 1.6, 1.6',
  },
];

export const useStarCss = (plant: number) => {
  return React.useMemo(() => {
    const res = Array.from(new Array(plant))
      .map((item, index) => index)
      .reduce((prev, cur) => {
        const activeIndex = cur % 10;
        const offsetX = Math.floor(cur / 10) * SCREEN_WIDTH;
        return `
      & .star-${cur} {
        transform: translate(${position[activeIndex].x + offsetX}px, ${
          position[activeIndex].y
        }px) scale3d(${position[activeIndex].scale3d});
      }
    ${prev};`;
      }, '');
    console.log(111, '===');
    return res;
  }, [plant]);
};

export const GlobeFlex = styled(Flex)<{ starCss: string }>`
  width: auto;
  height: 100%;
  /* transform-style: preserve-3d;
  perspective: 2000px; */
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
  /* .ball:hover, */
  .active {
    /* transform: scale(0.5); */
    /* transition: transform 0.3s; */
    animation: ${StarScaleFrame} 1s ease-in-out both;
  }

  // 行星外层动画
  .animation {
    /* animation: ${StarMoveFrame} 2s ease-in-out infinite; */
  }
  ${({ starCss }) => starCss};
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
  left: 6px;
  bottom: 16px;
`;

export const LinkStyled = styled(Link)`
  :hover {
    text-decoration: underline;
    text-decoration-color: #fff;
  }
`;
