import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Box, Flex, BackButton, RefreshButton, Text } from 'uikit';

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
          <Text>传说 Lv232131</Text>
        </Flex>
      </Flex>
      <Flex>
        <Box>
          <Text>导航</Text>
          <Link to='/star/child'>
            <Text>搜索</Text>
          </Link>
        </Box>
      </Flex>
      <Outlet />
    </Layout>
  );
};

export default Star;
