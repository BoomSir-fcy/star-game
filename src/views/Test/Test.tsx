import React from 'react';
import { Outlet, Routes, Route, useLocation } from 'react-router-dom';
import { Heading, Text, Flex, Box, Card, BgCard, BackButton } from 'uikit';
import Nav from 'components/Nav';
import Layout from 'components/Layout';

const Test: React.FC = () => {
  return (
    <Layout>
      <BackButton ml='16px' />
      <Flex width='100%' flexDirection='column' alignItems='center'>
        <Heading>Test</Heading>
        <Text>开发测试页面</Text>
        <Flex width='100%'>
          <Nav
            nav={[
              {
                id: 'card',
                label: '卡片',
                path: '/test/card',
              },
              {
                id: 'bg-card',
                label: '背景卡片',
                path: '/test/bg-card',
              },
              {
                id: 'button',
                label: '按钮',
                path: '/test/button',
              },
              {
                id: 'star',
                label: '星球',
                path: '/test/star',
              },
            ]}
          />
          <Flex ml='50px' flex={1}>
            <Outlet />
          </Flex>
        </Flex>
      </Flex>
    </Layout>
  );
};

export default Test;
