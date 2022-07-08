import styled from 'styled-components';
import { Box } from 'uikit';
import LeagueStarAddBtn from './LeagueStarAddBtn';

export const Content = styled.div`
  width: 100%;
  height: calc(100% - 80px);
  /* position: relative; */
`;
export const Section = styled.div``;

/* 中间圆球位置 */
export const CenterBox = styled.div`
  background: url('/images/planetary_alliance/power.png') no-repeat center
    center;
  background-size: 100% 100%;
`;

export const UiBase = styled.div``;

export const Base = styled.div``;

export const BallBase = styled.div``;

export const Ball = styled(LeagueStarAddBtn)``;

export const PlanetLeague = styled.div`
  position: absolute;
  width: 70%;
  height: 70%;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
`;

export const ToFind = styled.div`
  position: fixed;
  top: -148px;
  right: 268px;
  height: 52px;
  width: 152px;
`;
