import React from 'react';
import styled from 'styled-components';
import { Box } from 'uikit';

const BoxStyled = styled(Box)`
  width: 500px;
  height: 500px;
  /* background: url('/images/game/board.png'); */
  background: skyblue;
  background-size: 100% 100%;
  /* transform: skew(10deg, -20deg); */
  perspective: 1000px;
  transform: rotate(10deg, 10deg, 10deg);
`;
const Board = () => {
  return <BoxStyled>棋盘</BoxStyled>;
};

export default Board;
