import React, { useState } from 'react';
import { Box, Text, Fringe, Button, Flex, RefreshButton, Spinner } from 'uikit';
import styled from 'styled-components';
import Layout from 'components/Layout';
import Dashboard from 'components/Dashboard';
import { GameBoard } from 'game';
import PeopleCard from './components/PeopleCard';
import VsVideo from './components/VsVideo';
import PixiTest from './components/PixiTest';
import { States } from './types';

const BoxStyled = styled(Box)`
  height: 607px;
  width: 100%;
  overflow: hidden;
`;

interface StateProps {
  state: States;
}

const PeopleCardLeft = styled(PeopleCard)<{ state: States }>`
  position: absolute;
  left: 150px;
  top: 20px;
  transition: transform 0.3s;
  transform-origin: top left;
  transform: ${({ state }) =>
    state === States.MATCHED || state === States.MATCHING
      ? ''
      : 'scale(0.5) translate(-300px, -20px)'};
  /* left: 0;
  top: 0; */
`;

const getPeopleRightTransform = ({ state }: StateProps) => {
  if (state === States.MATCHING) {
    return 'transform: scale(1) translate(800px, 0)';
  }
  if (state === States.MATCHED) {
    return 'transform: scale(1) translate(0, 0)';
  }
  return 'transform: scale(0.5) translate(300px, -20px)';
};
const PeopleCardRight = styled(PeopleCard)<{ state: States }>`
  position: absolute;
  right: 150px;
  top: 20px;
  transition: transform 0.3s;
  transform-origin: top right;

  ${getPeopleRightTransform}
`;

const VsVideoStyled = styled(VsVideo)`
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
  top: 50px;
`;

const ButtonBox = styled(Flex)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
`;

const SpinnerBox = styled(Box)`
  position: absolute;
  right: 150px;
  top: 20px;
`;

const GameBox = styled(Box)`
  width: 800px;
  height: 800px;
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
`;

const Plunder = () => {
  const [state, setState] = useState(States.MATCHING);

  return (
    <Layout>
      <Dashboard />
      <BoxStyled position='relative'>
        <PeopleCardLeft state={state} />
        <Fringe />
        <VsVideoStyled />
        {state === States.MATCHING && (
          <SpinnerBox>
            <Spinner />
          </SpinnerBox>
        )}
        <PeopleCardRight state={state} />
        <GameBox>
          {/* <GameBoard /> */}
          <PixiTest />
        </GameBox>

        <ButtonBox justifyContent='center' alignItems='center'>
          <Button
            variant='vs'
            onClick={() => {
              setState(prev => {
                if (prev === States.DEFEAT) return States.MATCHING;
                return prev + 1;
              });
            }}
          >
            开始掠夺
          </Button>
          <RefreshButton variant='vsRefresh' />
        </ButtonBox>
      </BoxStyled>
    </Layout>
  );
};

export default Plunder;
