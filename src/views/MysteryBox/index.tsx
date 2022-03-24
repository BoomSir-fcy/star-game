import React from 'react';
import { Box, Text } from 'uikit';
import Layout from 'components/Layout';
import Dashboard from 'components/Dashboard';

const MysteryBox = () => {
  return (
    <Layout>
      <Dashboard />
      <Text>盲盒</Text>
    </Layout>
  );
};

export default MysteryBox;
