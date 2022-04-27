import styled from 'styled-components';
import { Box, Flex, Image } from 'uikit';
import { GamePkState } from 'state/types';
import PeopleCard from './PeopleCard';
import VsVideo from './VsVideo';
import PixiTest from './PixiTest';

export const BoxStyled = styled(Box)`
  height: 607px;
  width: 100%;
  overflow: hidden;
`;

interface StateProps {
  state: GamePkState;
}

export const PeopleCardLeft = styled(PeopleCard)<{ state: GamePkState }>`
  position: absolute;
  left: 150px;
  top: 20px;
  transition: transform 0.3s;
  transform-origin: top left;
  transform: ${({ state }) =>
    state === GamePkState.MATCHED ||
    state === GamePkState.MATCHING ||
    state === GamePkState.MATCH_ERROR
      ? 'scale(1.5) translate(0, 0)'
      : 'scale(1) translate(-150px, -20px)'};
  /* left: 0;
top: 0; */
`;

export const getPeopleRightTransform = ({ state }: StateProps) => {
  if (state === GamePkState.MATCHING) {
    return 'transform: scale(1.5) translate(800px, 0)';
  }
  if (state === GamePkState.MATCHED || state === GamePkState.MATCH_ERROR) {
    return 'transform: scale(1.5) translate(0, 0)';
  }
  return 'transform: scale(1) translate(150px, -20px)';
};

export const PeopleCardRight = styled(PeopleCard)<{ state: GamePkState }>`
  position: absolute;
  right: 150px;
  top: 20px;
  transition: transform 0.3s;
  transform-origin: top right;

  ${getPeopleRightTransform}
`;

export const VsVideoStyled = styled(VsVideo)`
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
  top: 50px;
`;

export const ButtonBox = styled(Flex)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
`;

export const SpinnerBox = styled(Box)`
  position: absolute;
  right: 150px;
  top: 20px;
`;

export const GameBox = styled(Box)`
  width: 800px;
  height: 800px;
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
`;
