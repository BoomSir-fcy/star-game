import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Box, Flex, BackButton, RefreshButton, Text } from 'uikit';
import Nav from 'components/Nav';
import Layout from 'components/Layout';
import useParsedQueryString from 'hooks/useParsedQueryString';
import { StarHeader } from './components';

const Star: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const parsedQs = useParsedQueryString();

  return (
    <Layout>
      <Flex padding='0 20px' mb='16px' justifyContent='space-between' flex={1}>
        <Box>
          <BackButton />
          <RefreshButton ml='33px' />
        </Box>
        <StarHeader />
      </Flex>
      <Flex width='100%'>
        <Nav
          nav={[
            {
              id: 'build',
              label: '星球建造',
              path: `/star?id=${parsedQs.id}`,
            },
            {
              id: 'upgrade',
              label: '星球升级',
              path: `/star/upgrade?id=${parsedQs.id}`,
            },
            {
              id: 'grow',
              label: '星球培育',
              path: `/star/grow?id=${parsedQs.id}`,
            },
            {
              id: 'search',
              label: '掠夺信息',
              path: `/star/search?id=${parsedQs.id}`,
            },
          ]}
        />
        <Flex ml='23px' flex={1}>
          {children}
        </Flex>
      </Flex>
    </Layout>
  );
};

export default Star;
