import React from 'react';
import styled from 'styled-components';
import { Box, Flex, BgCard, Text, Input } from 'uikit';

import useParsedQueryString from 'hooks/useParsedQueryString';

import Layout from 'components/Layout';
import Dashboard from 'components/Dashboard';
import Nav from 'components/Nav';

import { PlanetSearch, PlanetBox } from './components';

const Planet = () => {
  const parsedQs = useParsedQueryString();

  console.log(parsedQs);
  return (
    <Layout>
      <Dashboard />
      <Flex width='100%'>
        <Nav
          nav={[
            {
              id: 'all',
              label: '全部',
              path: '/star/planet?t=all',
            },
            {
              id: 'normal',
              label: '普通',
              path: '/star/planet?t=normal',
            },
            {
              id: 'good',
              label: '良好',
              path: '/star/planet?t=good',
            },
            {
              id: 'rare',
              label: '稀有',
              path: '/star/planet?t=rare',
            },
            {
              id: 'epic',
              label: '史诗',
              path: '/star/planet?t=epic',
            },
            {
              id: 'legendary',
              label: '传说',
              path: '/star/planet?t=legendary',
            },
            {
              id: 'mythical',
              label: '神话',
              path: '/star/planet?t=mythical',
            },
          ]}
        />
        <Flex ml='23px' flex={1}>
          <BgCard variant='big' fringe padding='40px 37px'>
            <PlanetSearch />
            <Flex
              mt='22px'
              justifyContent='space-between'
              flexWrap='wrap'
              style={{
                overflow: 'auto',
              }}
            >
              <PlanetBox level='rare' />
              <PlanetBox status='upgrade' level='legend' />
              <PlanetBox level='rare' />
            </Flex>
          </BgCard>
        </Flex>
      </Flex>
    </Layout>
  );
};

export default Planet;
