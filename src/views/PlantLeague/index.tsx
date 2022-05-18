import React from 'react';
import { Box, Flex, Text } from 'uikit';
import Layout from 'components/Layout';
import Dashboard from 'components/Dashboard';
import { useFetchAllianceView } from 'state/alliance/hooks';
import { useDispatch } from 'react-redux';
import { fetchAllianceViewAsync } from 'state/alliance/reducer';
import eventBus from 'utils/eventBus';
import { Steps, Hints } from 'intro.js-react'; // 引入我们需要的组件
import JoinTheAlliance from './Join';
import LeagueInfo from './LeagueInfo';

import 'intro.js/introjs.css';

const PlantLeague = () => {
  useFetchAllianceView();
  const dispatch = useDispatch();

  const [stepsEnabled, setStepsEnabled] = React.useState(true);
  const [steps, setSteps] = React.useState([
    {
      element: '.planet',
      intro: '星际探索需要3~5个星球组成才可进行，星际探索可以发掘更多资源。',
    },
    {
      element: '.planet_info',
      intro: '这里展示为星球联盟的资源和战力，以及包含的可用资产等。',
    },
    {
      element: '.test-add',
      intro: '点击选择一个星球，加入联盟',
    },
  ]);

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
      <Steps
        enabled={stepsEnabled}
        steps={steps}
        initialStep={0}
        options={{
          exitOnOverlayClick: false,
        }}
        onExit={step => {
          // if (step === 1) {
          //   const newStep = {
          //     element: '.test-add',
          //     intro: '点击选择一个星球，加入联盟',
          //   };
          //   setSteps([...steps, newStep]);
          // }
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
