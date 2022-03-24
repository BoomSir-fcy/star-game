import React from 'react';
import { Box, Text } from 'uikit';
import Layout from 'components/Layout';
import Dashboard from 'components/Dashboard';

const MysteryBoxState = () => {
  return (
    <Layout>
      <Dashboard />
      <Text>盲盒状态</Text>
    </Layout>
  );
};

export default MysteryBoxState;
