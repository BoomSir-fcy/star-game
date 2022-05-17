import React, { useCallback, useState, useEffect } from 'react';

import { Steps, Hints } from 'intro.js-react'; // 引入我们需要的组件
import 'intro.js/introjs.css';

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
  Spinner,
  Button,
} from 'uikit';

import useParsedQueryString from 'hooks/useParsedQueryString';
import { useTranslation } from 'contexts/Localization';
import Layout from 'components/Layout';
import Nav from 'components/Nav';
import { useStore } from 'state/util';
import { fetchMePlanetAsync } from 'state/planet/fetchers';
import { setActivePlanet } from 'state/planet/actions';
import { fetchAllianceViewAsync } from 'state/alliance/reducer';
import { useToast } from 'contexts/ToastsContext';
import eventBus from 'utils/eventBus';
import { PlanetSearch, PlanetRaceTabs, PlanetBox } from './components';
import { useJoinAlliance } from './hook';

const ScrollBox = styled(Flex)`
  margin-top: 22px;
  min-height: 450px;
  max-height: 450px;
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

const LoadingBox = styled(Box)`
  position: absolute;
  left: 56%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const Planet = () => {
  const { t } = useTranslation();
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
  const [pending, setpending] = useState(false);
  const [StarList, setStarList] = useState<Api.Planet.PlanetInfo[]>([]);
  const [ChooseList, setChooseList] = useState<number[]>([]);
  const mePlanet = useStore(p => p.planet.mePlanet);
  const workingList = useStore(p => p.alliance.workingPlanet);
  const { SetWorking } = useJoinAlliance();

  // 控制是否开启新手指导的
  const [stepsEnabled, setStepsEnabled] = useState(false);
  const [steps, setSteps] = useState([
    {
      element: '.planet_number',
      intro: '星球数量',
    },
    {
      element: '.planet_list',
      intro:
        'The simplicity of Intro.js API helps you develop an advanced onboarding tour for your products. Intro.js is lightweight, 10kB and has no external dependencies!',
    },
  ]);
  // 是否开启提示的
  const [hintsEnabled, setHintsEnabled] = useState(true);
  // 设置哪些需要提示
  const [hints, setHints] = useState([
    {
      element: '.planet_number',
      hint: 'Hello hint',
      hintPosition: 'middle-right',
    },
  ]);

  const ToSetWorking = useCallback(async () => {
    if (pending) {
      return;
    }
    setpending(true);
    try {
      const ChooseListStr = ChooseList.join();
      const workingListStr = workingList.join();
      if (ChooseListStr === workingListStr) {
        toastError(t('The alliance has not changed'));
        return;
      }
      await SetWorking(ChooseList);
      toastSuccess(t('Join Succeeded'));
      navigate('/plant-league');
    } catch (e) {
      console.error(e);
      toastError(t('Join Failed'));
    } finally {
      setpending(false);
    }
  }, [
    t,
    SetWorking,
    toastSuccess,
    toastError,
    navigate,
    setpending,
    ChooseList,
    workingList,
    pending,
  ]);

  const addPlanetToList = useCallback(
    (id: number) => {
      const list = ChooseList.concat([]);
      const index = list.indexOf(id);
      if (index === -1) {
        // 选择
        if (ChooseList.length >= 5) {
          // 满了
          return;
        }
        list.push(id);
      } else {
        // 取消选择
        list.splice(index, 1);
      }
      setChooseList(list);
    },
    [ChooseList, setChooseList],
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
  }, [dispatch, state, parsedQs.t]);

  useEffect(() => {
    // if (choose && mePlanet.length) {
    //   const list = mePlanet.filter(item => {
    //     return !workingList.includes(item.id);
    //   });
    //   setStarList(list);
    // } else {
    // }
    setStarList(mePlanet);
  }, [mePlanet]);

  useEffect(() => {
    setChooseList(workingList);
  }, [workingList]);

  useEffect(() => {
    init();
  }, [parsedQs.t, state.race, state.token, init]);

  useEffect(() => {
    if (choose) {
      dispatch(fetchAllianceViewAsync());
    }
  }, [choose, dispatch]);

  // 将步骤关掉
  const onExit = () => {
    setStepsEnabled(false);
  };
  // 设置是否开始引导
  const toggleSteps = () => {
    setStepsEnabled(!stepsEnabled);
  };
  // 增加引导部署
  const addStep = () => {
    const newStep = {
      element: '.test-add', // 这里应该是动态的哈
      intro: 'Test step', // 这里应该是动态的哈
    };
    setSteps([...steps, newStep]);
  };
  // 控制是否提示
  const toggleHints = () => {
    setHintsEnabled(!hintsEnabled);
  };
  // 增加提示
  const addHint = () => {
    const newHint = {
      element: '.test', // 这里应该是动态的哈
      hint: 'Test hint', // 这里应该是动态的哈
      hintPosition: 'middle-right', // 这里应该是动态的哈
    };
    setHints([...hints, newHint]);
  };

  const onRefreshClick = React.useCallback(() => {
    init();
  }, [init]);

  // 添加事件监听，用于更新状态
  React.useEffect(() => {
    eventBus.addEventListener('onRefresh', onRefreshClick);
    return () => {
      eventBus.removeEventListener('onRefresh', onRefreshClick);
    };
  }, [onRefreshClick]);

  return (
    <Box id='containerBox'>
      <Steps
        enabled={stepsEnabled}
        steps={steps}
        initialStep={0}
        options={{
          exitOnOverlayClick: false,
          tooltipPosition: 'top',
        }}
        onExit={() => console.log('退出')}
      />
      <Hints enabled={hintsEnabled} hints={hints} />
      <Layout>
        <Flex width='100%' position='relative'>
          <Box>
            {choose && (
              <Flex padding='0 20px' mb='60px'>
                <BackButton />
                <RefreshButton ml='33px' />
              </Flex>
            )}
            <Nav
              className='planet_number'
              activeId={Number(parsedQs.t)}
              nav={[
                {
                  id: 0,
                  label: t('All'),
                  path: `/star/planet?t=0&choose=${choose || ''}`,
                },
                {
                  id: 1,
                  label: t('rarity-1'),
                  path: `/star/planet?t=1&choose=${choose || ''}`,
                },
                {
                  id: 2,
                  label: t('rarity-2'),
                  path: `/star/planet?t=2&choose=${choose || ''}`,
                },
                {
                  id: 3,
                  label: t('rarity-3'),
                  path: `/star/planet?t=3&choose=${choose || ''}`,
                },
                {
                  id: 4,
                  label: t('rarity-4'),
                  path: `/star/planet?t=4&choose=${choose || ''}`,
                },
                {
                  id: 5,
                  label: t('rarity-5'),
                  path: `/star/planet?t=5&choose=${choose || ''}`,
                },
                {
                  id: 6,
                  label: t('rarity-6'),
                  path: `/star/planet?t=6&choose=${choose || ''}`,
                },
              ]}
            />
          </Box>
          <Flex ml={choose ? '7px' : '23px'} flex={1}>
            <BgCard
              variant={choose ? 'full' : 'medium'}
              fringe
              padding='40px 37px'
            >
              <Flex justifyContent='space-between'>
                <PlanetRaceTabs
                  callBack={id => setState({ ...state, race: id })}
                  current={state.race}
                />
                <PlanetSearch
                  onEndCallback={e => setState({ ...state, token: e })}
                />
              </Flex>
              <ScrollBox className='planet_list'>
                {(StarList ?? []).map(item => (
                  <React.Fragment key={`${item.id}_${item.name}`}>
                    {choose ? (
                      <Box
                        onClick={() => {
                          dispatch(setActivePlanet(item));
                          addPlanetToList(item.id);
                        }}
                      >
                        <PlanetBox choose ChooseList={ChooseList} info={item} />
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
              </ScrollBox>
              {choose && (
                <Flex justifyContent='center' paddingTop='20px'>
                  <Button variant='vs' onClick={() => ToSetWorking()}>
                    {t('Join in')}
                  </Button>
                </Flex>
              )}
            </BgCard>
          </Flex>
          {pending && (
            <LoadingBox>
              <Spinner size={200} />
            </LoadingBox>
          )}
        </Flex>
      </Layout>
    </Box>
  );
};

export default Planet;
