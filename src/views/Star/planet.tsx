import React from 'react';
import styled from 'styled-components';
import {
  Box,
  Flex,
  BgCard,
  Text,
  Input,
  BackButton,
  RefreshButton,
} from 'uikit';

import useParsedQueryString from 'hooks/useParsedQueryString';

import Layout from 'components/Layout';
import Dashboard from 'components/Dashboard';
import Nav from 'components/Nav';

import { PlanetSearch, PlanetBox } from './components';

const Planet = () => {
  const parsedQs = useParsedQueryString();
  const choose = parsedQs.choose;
  console.log(choose);

  return (
    <Layout>
      {!choose && <Dashboard />}
      <Flex width='100%'>
        <Box>
          {choose && (
            <Flex padding='0 20px' mb='60px'>
              <BackButton />
              <RefreshButton ml='33px' />
            </Flex>
          )}
          <Nav
            nav={[
              {
                id: 'all',
                label: '全部',
                path: `/star/planet?t=all${choose ? '&choose=1' : ''}`,
              },
              {
                id: 'normal',
                label: '普通',
                path: `/star/planet?t=normal${choose ? '&choose=1' : ''}`,
              },
              {
                id: 'good',
                label: '良好',
                path: `/star/planet?t=good${choose ? '&choose=1' : ''}`,
              },
              {
                id: 'rare',
                label: '稀有',
                path: `/star/planet?t=rare${choose ? '&choose=1' : ''}`,
              },
              {
                id: 'epic',
                label: '史诗',
                path: `/star/planet?t=epic${choose ? '&choose=1' : ''}`,
              },
              {
                id: 'legendary',
                label: '传说',
                path: `/star/planet?t=legendary${choose ? '&choose=1' : ''}`,
              },
              {
                id: 'mythical',
                label: '神话',
                path: `/star/planet?t=mythical${choose ? '&choose=1' : ''}`,
              },
            ]}
          />
        </Box>
        <Flex ml={choose ? '7px' : '23px'} flex={1}>
          <BgCard variant={choose ? 'full' : 'big'} fringe padding='40px 37px'>
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
