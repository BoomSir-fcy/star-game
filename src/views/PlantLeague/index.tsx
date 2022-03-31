import React from 'react';
import { Box, Flex, Text } from 'uikit';
import Layout from 'components/Layout';
import Dashboard from 'components/Dashboard';
import { useFetchAllianceView } from 'state/alliance/hooks';
import JoinTheAlliance from './Join';
import LeagueInfo from './LeagueInfo';

const PlantLeague = () => {
  useFetchAllianceView();
  return (
    <Layout>
      <Dashboard />
      <Flex justifyContent='space-between' padding='0 30px'>
        <JoinTheAlliance />
        <LeagueInfo />
      </Flex>
    </Layout>
  );
};

export default PlantLeague;
