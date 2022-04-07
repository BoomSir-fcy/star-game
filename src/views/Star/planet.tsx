import React, { useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
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
import { setActivePlanet } from 'state/planet/actions';
import { fetchAllianceViewAsync } from 'state/alliance/reducer';
import { useToast } from 'contexts/ToastsContext';
import { PlanetSearch, PlanetRaceTabs, PlanetBox } from './components';
import { useJoinAlliance } from './hook';

const ScrollBox = styled(Flex)`
  margin-top: 22px;
  min-height: 550px;
  max-height: 550px;
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
  const { toastError, toastSuccess, toastWarning } = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const parsedQs = useParsedQueryString();
  const { choose } = parsedQs;
  const [state, setState] = useState({
    page: 1,
    token: '',
    race: 0,
  });
  const [StarList, setStarList] = useState<Api.Planet.PlanetInfo[]>([]);
  const mePlanet = useStore(p => p.planet.mePlanet);
  const workingList = useStore(p => p.alliance.workingPlanet);
  const { SetWorking } = useJoinAlliance();

  const ToSetWorking = useCallback(
    async (id: number) => {
      try {
        let newList = workingList.concat([]);
        if (newList.indexOf(Number(id)) !== -1) {
          toastWarning('该星球已在联盟中');
          return;
        }
        if (newList.indexOf(Number(choose)) === -1) {
          // 添加星球
          newList.push(id);
        } else if (
          Number(choose) !== 1 &&
          newList.indexOf(Number(choose)) !== -1
        ) {
          // 替换星球
          const index = newList.indexOf(Number(choose));
          newList = newList.splice(index, 1, id);
        }
        console.log(newList);
        await SetWorking(id, newList);
        toastSuccess('加入成功');
        navigate('/plant-league');
      } catch (e) {
        console.log(e);
        toastError('加入失败');
      }
    },
    [SetWorking, workingList, choose],
  );

  const init = useCallback(() => {
    dispatch(
      fetchMePlanetAsync({
        page: state.page,
        page_size: 10,
        token: state.token,
        race: state.race,
        rarity: Number(parsedQs.t) || 0,
      }),
    );
    dispatch(fetchAllianceViewAsync());
  }, [dispatch, state, parsedQs.t]);

  useEffect(() => {
    if (choose) {
      const list = mePlanet.filter(item => {
        return item.id !== Number(choose);
      });
      setStarList(list);
    } else {
      setStarList(mePlanet);
    }
  }, [mePlanet, choose]);

  useEffect(() => {
    init();
  }, [parsedQs.t, choose, state.race, state.token]);

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
            activeId={Number(parsedQs.t)}
            nav={[
              {
                id: 0,
                label: '全部',
                path: `/star/planet?t=0&choose=${choose || ''}`,
              },
              {
                id: 1,
                label: '普通',
                path: `/star/planet?t=1&choose=${choose || ''}`,
              },
              {
                id: 2,
                label: '良好',
                path: `/star/planet?t=2&choose=${choose || ''}`,
              },
              {
                id: 3,
                label: '稀有',
                path: `/star/planet?t=3&choose=${choose || ''}`,
              },
              {
                id: 4,
                label: '史诗',
                path: `/star/planet?t=4&choose=${choose || ''}`,
              },
              {
                id: 5,
                label: '传说',
                path: `/star/planet?t=5&choose=${choose || ''}`,
              },
              {
                id: 6,
                label: '神话',
                path: `/star/planet?t=6&choose=${choose || ''}`,
              },
            ]}
          />
        </Box>
        <Flex ml={choose ? '7px' : '23px'} flex={1}>
          <BgCard variant={choose ? 'full' : 'big'} fringe padding='40px 37px'>
            <Flex justifyContent='space-between'>
              <PlanetRaceTabs
                callBack={id => setState({ ...state, race: id })}
                current={state.race}
              />
              <PlanetSearch
                onEndCallback={e => setState({ ...state, token: e })}
              />
            </Flex>
            <ScrollBox>
              {(StarList ?? []).map(item => (
                <React.Fragment key={`${item.id}_${item.name}`}>
                  {choose ? (
                    <Box
                      onClick={() => {
                        dispatch(setActivePlanet(item));
                        ToSetWorking(item.id);
                      }}
                    >
                      <PlanetBox info={item} />
                    </Box>
                  ) : (
                    <LinkItem to={`/star?id=${item.id}`}>
                      <Box
                        onClick={() => {
                          dispatch(setActivePlanet(item));
                        }}
                      >
                        <PlanetBox info={item} />
                      </Box>
                    </LinkItem>
                  )}
                </React.Fragment>
              ))}
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
