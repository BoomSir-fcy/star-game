import React, { useCallback, useState, useEffect, useMemo } from 'react';

import { Steps, Hints } from 'intro.js-react'; // 引入我们需要的组件
import 'intro.js/introjs.css';

import styled, { createGlobalStyle } from 'styled-components';
import { useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
import { storeAction, useStore } from 'state';
import { fetchMePlanetAsync } from 'state/planet/fetchers';
import { setActivePlanet } from 'state/planet/actions';
import { fetchAllianceViewAsync } from 'state/alliance/reducer';
import { useToast } from 'contexts/ToastsContext';
import eventBus from 'utils/eventBus';
import { useGuide } from 'hooks/useGuide';
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

const GlobalStyle = createGlobalStyle<{
  interactive?: boolean;
  disabled?: boolean;
}>`

  ${({ disabled }) => {
    return disabled
      ? `
    .introjs-nextbutton {
      pointer-events: none !important;
      color: #9e9e9e !important;
      cursor: default !important;
    }
    `
      : '';
  }};


  ${({ interactive }) => {
    return interactive
      ? `
    *{
      pointer-events: none;
    }
    .introjs-showElement, .introjs-showElement *, .introjs-tooltip, .introjs-tooltip *{
      pointer-events: auto;
    }
    `
      : '';
  }};
  
`;

const Planet = () => {
  const { t } = useTranslation();
  const { toastError, toastSuccess, toastWarning } = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const parsedQs = useParsedQueryString();
  const { choose } = parsedQs;

  const guideRef = React.useRef(null);
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

  const { guides, setGuide } = useGuide(
    `${location.pathname}${location.search}`,
  );

  // 控制是否开启新手指导的
  const [stepsEnabled, setStepsEnabled] = useState(false);
  const [activeStep, setActiveStep] = React.useState(guides.step);
  const steps = useMemo(
    () => [
      {
        element: '.planet_choose_0',
        intro: t('Click to select the planet.'),
        interactive: true,
      },
      {
        element: '.planet_choose_button',
        intro: t('Click Add planet.'),
        interactive: true,
        disabled: true,
      },
      {
        element: '.planet_list_content',
        intro: t('Click on the planet list.'),
        interactive: true,
      },
      {
        element: '.planet_choose_button',
        intro: t('Click Add planet.'),
        interactive: true,
        disabled: true,
      },
    ],
    [t],
  );

  const planetSteps = useMemo(() => {
    return [
      {
        element: '.header_asset',
        intro: t('This is your token asset.'),
      },
      {
        element: '.header_resource',
        intro: t(
          'Here is the total capacity and resources of all your planets.',
        ),
      },
      {
        element: '.header_explore',
        intro: t(
          'Click to enter the Star Alliance to start interstellar exploration',
        ),
        interactive: true,
        disabled: true,
      },
    ];
  }, [t]);

  const destroy = React.useCallback(
    (n: number) => {
      if (!guides.guideFinish) {
        setGuide(n);
      }
    },
    [guides, setGuide],
  );

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
      setTimeout(() => {
        destroy(activeStep + 1);
        dispatch(storeAction.toggleVisible({ visible: true }));
      }, 100);
    } catch (e) {
      console.error(e);
      toastError(t('Join Failed'));
    } finally {
      setpending(false);
    }
  }, [
    pending,
    ChooseList,
    workingList,
    SetWorking,
    toastSuccess,
    t,
    navigate,
    toastError,
    destroy,
    activeStep,
    dispatch,
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

  const onRefreshClick = React.useCallback(() => {
    init();
  }, [init]);

  React.useEffect(() => {
    if (guides.finish && !guides.guideFinish) {
      setStepsEnabled(true);
    }
  }, [choose, guides]);

  // 添加事件监听，用于更新状态
  React.useEffect(() => {
    eventBus.addEventListener('onRefresh', onRefreshClick);
    return () => {
      eventBus.removeEventListener('onRefresh', onRefreshClick);
    };
  }, [onRefreshClick]);

  React.useEffect(() => {
    return () => {
      dispatch(storeAction.toggleVisible({ visible: false }));
    };
  }, [dispatch]);

  // React.useEffect(() => {
  //   setGuide(0);
  // }, [destroy, guides, setGuide]);
  const currentSteps = choose ? steps : planetSteps;

  return (
    <Box id='containerBox'>
      <GlobalStyle
        interactive={currentSteps[activeStep]?.interactive && stepsEnabled}
        disabled={currentSteps[activeStep]?.disabled}
      />
      {!guides.guideFinish &&
        guides.finish &&
        steps.length - 1 > guides.step &&
        StarList.length > 0 && (
          <Steps
            ref={guideRef}
            enabled={stepsEnabled}
            steps={currentSteps}
            initialStep={guides.step}
            options={{
              exitOnOverlayClick: false,
            }}
            onBeforeChange={event => {
              setActiveStep(event);
            }}
            onChange={currentStep => {
              console.log(currentStep, 'currentStep', guides.step);
              if (currentStep === 3) return;
              if (currentStep > guides.step) {
                setGuide(currentStep);
              }
            }}
            onExit={step => {
              setStepsEnabled(false);
              if (!choose) {
                setGuide(step + 1);
                return;
              }
              if (step === currentSteps.length) {
                dispatch(storeAction.toggleVisible({ visible: true }));
              }
            }}
          />
        )}
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
              <ScrollBox className='planet_list_content'>
                {(StarList ?? []).map((item, index) => (
                  <React.Fragment key={`${item.id}_${item.name}`}>
                    {choose ? (
                      <Box
                        onClick={() => {
                          dispatch(setActivePlanet(item));
                          addPlanetToList(item.id);
                        }}
                      >
                        <PlanetBox
                          choose
                          ChooseList={ChooseList}
                          info={item}
                          className={`${
                            guides.step <= 1 && `planet_choose_${index}`
                          }`}
                        />
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
                <Flex
                  justifyContent='center'
                  paddingTop='20px'
                  className='planet_choose_button'
                >
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
