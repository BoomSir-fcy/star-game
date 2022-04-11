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
      <GamePK planetId={1001} />
    </Layout>
  );
};

export default Plunder;
