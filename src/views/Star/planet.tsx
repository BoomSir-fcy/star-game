import React from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
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
import { useStore } from 'state/util';
import { fetchMePlanetAsync } from 'state/planet/fetchers';
import { PlanetSearch, PlanetRaceTabs, PlanetBox } from './components';

const ScrollBox = styled(Flex)`
  margin-top: 22px;
  min-height: 650px;
  max-height: 650px;
  overflow-y: auto;
  flex-wrap: wrap;
  align-content: flex-start;
  justify-content: space-between;
`;

const LinkItem = styled(Link)`
  display: block;
  height: auto;
  margin-bottom: 20px;
`;

const Planet = () => {
  const dispatch = useDispatch();
  const parsedQs = useParsedQueryString();
  const { choose } = parsedQs;
  const StarList = useStore(p => p.planet.mePlanet);
  const [state, setState] = React.useState({
    page: 1,
  });

  const init = React.useCallback(() => {
    dispatch(fetchMePlanetAsync({ page: state.page, page_size: 10 }));
  }, [dispatch, state]);

  React.useEffect(() => {
    init();
  }, []);

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
            <Flex justifyContent='space-between'>
              <PlanetRaceTabs />
              <PlanetSearch />
            </Flex>
            <ScrollBox>
              {StarList.length && (
                <>
                  {StarList.map(item => (
                    <>
                      {choose ? (
                        <Box>
                          <PlanetBox info={item} />
                        </Box>
                      ) : (
                        <LinkItem to='/star'>
                          <PlanetBox info={item} />
                        </LinkItem>
                      )}
                    </>
                  ))}
                </>
              )}
              {/* <LinkItem to='/star'>
                <PlanetBox level='rare' />
              </LinkItem>

              <LinkItem to='/star'>
                <PlanetBox status='upgrade' level='legend' />
              </LinkItem>
              <PlanetBox level='rare' /> */}
            </ScrollBox>
          </BgCard>
        </Flex>
      </Flex>
    </Layout>
  );
};

export default Planet;
