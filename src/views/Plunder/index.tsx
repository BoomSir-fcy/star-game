import React, { useState } from 'react';
import { Box, Text, Fringe, Button, Flex, RefreshButton, Spinner } from 'uikit';
import styled from 'styled-components';
import Layout from 'components/Layout';
import Dashboard from 'components/Dashboard';
import { GameBoard } from 'game';
import PeopleCard from './components/PeopleCard';
import VsVideo from './components/VsVideo';
import GamePK from './components/GamePK';
import { States } from './types';
import {
  BoxStyled,
  PeopleCardLeft,
  PeopleCardRight,
  VsVideoStyled,
  ButtonBox,
  SpinnerBox,
  GameBox,
} from './components/styled';

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
        <GameBox>{/* <GamePK planetId={1001} /> */}</GameBox>

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
