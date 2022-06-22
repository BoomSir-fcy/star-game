import React from 'react';
import { Outlet, Routes, Route, useLocation } from 'react-router-dom';
import {
  Heading,
  Text,
  Flex,
  Box,
  Card,
  BgCard,
  BackButton,
  Spinner,
} from 'uikit';
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
                id: 'drag',
                label: '拖动',
                path: '/test/drag',
              },
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
              {
                id: 'text',
                label: '文字',
                path: '/test/text',
              },
              {
                id: 'label',
                label: 'Label',
                path: '/test/label',
              },
            ]}
          />
          <Flex ml='50px' flex={1}>
            <Outlet />
            {/* <Spinner /> */}
          </Flex>
        </Flex>
      </Flex>
    </Layout>
  );
};

export default Test;
