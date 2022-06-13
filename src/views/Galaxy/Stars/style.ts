import styled from 'styled-components';
import { BgCard, Box, Button } from 'uikit';
import { PeopleCard } from 'views/Plunder/components';

export const StarBox = styled(Box)`
  position: relative;
  width: 60%;
  height: 558px;
  /* flex: 1; */
  .star-1 {
    position: absolute;
    top: 30px;
    left: 0;
  }
  .star-2 {
    position: absolute;
    top: 200px;
    left: 100px;
  }
  .star-3 {
    position: absolute;
    top: 370px;
    left: 200px;
  }
  .star-4 {
    position: absolute;
    top: 200px;
    left: 300px;
  }
  .star-5 {
    position: absolute;
    top: 30px;
    left: 400px;
  }
  .star-6 {
    position: absolute;
    top: 30px;
    left: 560px;
  }
  .star-7 {
    position: absolute;
    top: 200px;
    left: 650px;
  }
  .star-8 {
    position: absolute;
    top: 370px;
    left: 750px;
  }
  .star-9 {
    position: absolute;
    top: 200px;
    left: 850px;
  }
  .star-10 {
    position: absolute;
    top: 30px;
    left: 950px;
  }
`;

export const ButtonStyled = styled(Button)`
  width: 219px;
  height: 61px;
  padding: 10px;
`;

export const BgCardStyled = styled(BgCard)`
  /* float: right; */
`;

export const PkPeopleCard = styled(PeopleCard)`
  margin: 30px 0;
  z-index: 1;
`;
