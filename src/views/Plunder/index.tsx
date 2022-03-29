import React from 'react';
import { Box, Text, Fringe } from 'uikit';
import styled from 'styled-components';
import Layout from 'components/Layout';
import Dashboard from 'components/Dashboard';
import PeopleCard from './components/PeopleCard';

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

const Plunder = () => {
  return (
    <Layout>
      <Dashboard />
      <Box position='relative'>
        <PeopleCardLeft />
        <Fringe />
        <PeopleCardRight />
      </Box>
    </Layout>
  );
};

export default Plunder;
