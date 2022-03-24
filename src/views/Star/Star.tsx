import React from 'react';
import { Box, Flex, BackButton, RefreshButton, Text } from 'uikit';
import { Outlet } from 'react-router-dom';
import Layout from 'components/Layout';

const Star = () => {
  return (
    <Layout>
      <Flex>
        <Box>
          <BackButton />
          <RefreshButton />
        </Box>
        <Flex>
          <Text>图片</Text>
          <Text>传说 Lv1</Text>
        </Flex>
      </Flex>
      <Flex>
        <Box>
          <Text>导航</Text>
        </Box>
        <Outlet />
      </Flex>
    </Layout>
  );
};

export default Star;
