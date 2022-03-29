import React from 'react';
import { Box, Text, Fringe } from 'uikit';
import styled from 'styled-components';
import Layout from 'components/Layout';
import Dashboard from 'components/Dashboard';
import PeopleCard from './components/PeopleCard';
import VsVideo from './components/VsVideo';

const BoxStyled = styled(Box)`
  /* height: 100%; */
`;

const PeopleCardLeft = styled(PeopleCard)`
  position: absolute;
  left: 150px;
  top: 20px;
`;

const PeopleCardRight = styled(PeopleCard)`
  position: absolute;
  right: 150px;
  top: 20px;
`;

const VsVideoStyled = styled(VsVideo)`
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
  top: 50px;
`;

const Plunder = () => {
  return (
    <Layout>
      <Dashboard />
      <BoxStyled position='relative'>
        <PeopleCardLeft />
        <Fringe />
        <VsVideoStyled />
        <PeopleCardRight />
      </BoxStyled>
    </Layout>
  );
};

export default Plunder;
