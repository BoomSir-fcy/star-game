import React, { useState } from 'react';
import {
  Box,
  Text,
  Fringe,
  Button,
  Flex,
  RefreshButton,
  BackButton,
  Spinner,
} from 'uikit';
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

const Pk = () => {
  const [state, setState] = useState(States.MATCHING);

  return (
    <Layout>
      <Flex>
        <Flex>
          <BackButton ml='19px' />
          <RefreshButton ml='33px' />
        </Flex>
        <Fringe />
        <Box />
      </Flex>
      <Flex>
        <PeopleCard />
        <Flex flex='1'>
          <Box>蓝色方</Box>
          <Box>我方行动 </Box>
          <Box>红色方</Box>
        </Flex>
        <PeopleCard />
      </Flex>
    </Layout>
  );
};

export default Pk;
