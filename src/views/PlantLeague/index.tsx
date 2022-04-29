import React from 'react';
import { Box, Flex, Text } from 'uikit';
import Layout from 'components/Layout';
import Dashboard from 'components/Dashboard';
import { useFetchAllianceView } from 'state/alliance/hooks';
import { useDispatch } from 'react-redux';
import { fetchAllianceViewAsync } from 'state/alliance/reducer';
import eventBus from 'utils/eventBus';
import JoinTheAlliance from './Join';
import LeagueInfo from './LeagueInfo';

const PlantLeague = () => {
  useFetchAllianceView();
  const dispatch = useDispatch();

  const onRefreshClick = React.useCallback(() => {
    dispatch(fetchAllianceViewAsync());
  }, [dispatch]);

  // 添加事件监听，用于更新状态
  React.useEffect(() => {
    eventBus.addEventListener('onRefresh', onRefreshClick);
    return () => {
      eventBus.removeEventListener('onRefresh', onRefreshClick);
    };
  }, [onRefreshClick]);

  return (
    <Layout>
      <Flex justifyContent='space-between' padding='0 30px'>
        <JoinTheAlliance />
        <LeagueInfo />
      </Flex>
    </Layout>
  );
};

export default PlantLeague;
