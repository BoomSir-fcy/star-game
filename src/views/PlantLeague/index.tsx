import React from 'react';
import { Box, Flex, Text } from 'uikit';
import Layout from 'components/Layout';
import Dashboard from 'components/Dashboard';
import { useFetchAllianceView } from 'state/alliance/hooks';
import { useDispatch } from 'react-redux';
import { fetchAllianceViewAsync } from 'state/alliance/reducer';
import JoinTheAlliance from './Join';
import LeagueInfo from './LeagueInfo';

const PlantLeague = () => {
  useFetchAllianceView();
  const dispatch = useDispatch();

  return (
    <Layout>
      <Dashboard
        onRefresh={async () => {
          dispatch(fetchAllianceViewAsync());
        }}
      />
      <Flex justifyContent='space-between' padding='0 30px'>
        <JoinTheAlliance />
        <LeagueInfo />
      </Flex>
    </Layout>
  );
};

export default PlantLeague;
