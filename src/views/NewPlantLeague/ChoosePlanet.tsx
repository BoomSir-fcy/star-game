import React, { useState, useEffect, useCallback } from 'react';
import {
  Text,
  Flex,
  Box,
  BackButton,
  RefreshButton,
  Spinner,
  Empty,
} from 'uikit';
import { Layout } from 'components';
import Nav from 'components/Nav';
import useParsedQueryString from 'hooks/useParsedQueryString';
import { useTranslation } from 'contexts/Localization';
import styled from 'styled-components';
import { PlanetRaceTabs, PlanetSearch } from 'views/Star/components';
import { useStore } from 'state';
import { useDispatch } from 'react-redux';
import { fetchMePlanetAsync } from 'state/planet/fetchers';
import { useFetchAllianceView } from 'state/alliance/hooks';

import ModalQueue from 'views/Star/components/planet/ModalQueue';
import { PlanetBox } from './components/Planet/PlanetBox';
import AlliancePlanetList from './components/Module/AlliancePlanetList';

const LoadingBox = styled(Box)`
  position: absolute;
  left: 56%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const BorderBox = styled(Box)`
  width: 100%;
  height: 100%;
  background: linear-gradient(270deg, #162d37, #0b1c22, #0a161b);
  border: 2px solid ${({ theme }) => theme.colors.borderPrimary};
  padding: 26px 30px;
`;

const ScrollBox = styled(Box)`
  margin-top: 22px;
  height: 520px;
  overflow-y: auto;
`;

const ChoosePlanet: React.FC = () => {
  useFetchAllianceView();

  const parsedQs = useParsedQueryString();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const mePlanet = useStore(p => p.planet.mePlanet);

  const [pending, setpending] = useState(false);
  const [state, setState] = useState({
    page: 1,
    token: '',
    race: 0,
  });
  const [StarList, setStarList] = useState<Api.Planet.PlanetInfo[]>([]);
  const [ShowListModule, setShowListModule] = useState(false);
  const [visible, setVisible] = useState(false);
  const [QueueId, setQueueId] = useState(0);

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
  }, [dispatch, state, parsedQs.t]);

  useEffect(() => {
    setStarList(mePlanet);
  }, [mePlanet]);

  useEffect(() => {
    init();
  }, [parsedQs.t, state.race, state.token, init]);

  return (
    <Box id='containerBox'>
      <Layout>
        <Flex width='100%' position='relative'>
          <Box>
            <Flex padding='0 20px' mb='60px'>
              <BackButton />
              {/* <RefreshButton ml='33px' /> */}
            </Flex>
            <Nav
              activeId={Number(parsedQs.t)}
              nav={[
                {
                  id: 0,
                  label: t('All'),
                  path: `/choose-planet?t=0`,
                },
                {
                  id: 1,
                  label: t('rarity-1'),
                  path: `/choose-planet?t=1`,
                },
                {
                  id: 2,
                  label: t('rarity-2'),
                  path: `/choose-planet?t=2`,
                },
                {
                  id: 3,
                  label: t('rarity-3'),
                  path: `/choose-planet?t=3`,
                },
                {
                  id: 4,
                  label: t('rarity-4'),
                  path: `/choose-planet?t=4`,
                },
                {
                  id: 5,
                  label: t('rarity-5'),
                  path: `/choose-planet?t=5`,
                },
                {
                  id: 6,
                  label: t('rarity-6'),
                  path: `/choose-planet?t=6`,
                },
              ]}
            />
          </Box>
          <Flex ml='30px' mr='30px' flex={1}>
            <BorderBox>
              <Flex justifyContent='space-between'>
                <PlanetRaceTabs
                  callBack={id => setState({ ...state, race: id })}
                  current={state.race}
                />
                <PlanetSearch
                  onEndCallback={e => setState({ ...state, token: e })}
                />
              </Flex>
              <ScrollBox className='planet_list_content'>
                {StarList.length ? (
                  <>
                    {(StarList ?? []).map((item, index) => (
                      <PlanetBox
                        key={`${item.id}_${item.name}`}
                        info={item}
                        className={`${`planet_choose_${index}`}`}
                        setShowListModule={e => {
                          if (item.in_queue) {
                            setVisible(true);
                          } else {
                            setShowListModule(e);
                          }
                        }}
                      />
                    ))}
                  </>
                ) : (
                  <Empty />
                )}
              </ScrollBox>
            </BorderBox>
          </Flex>
          {pending && (
            <LoadingBox>
              <Spinner size={200} />
            </LoadingBox>
          )}
          <AlliancePlanetList
            ShowListModule={ShowListModule}
            setShowListModule={e => setShowListModule(e)}
          />
        </Flex>
      </Layout>
      <ModalQueue
        plantId={QueueId}
        visible={visible}
        setVisible={setVisible}
        callBack={e => {
          setVisible(false);
          setShowListModule(true);
        }}
      />
    </Box>
  );
};

export default ChoosePlanet;
