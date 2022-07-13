import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import {
  Box,
  Text,
  Fringe,
  Button,
  Flex,
  RefreshButton,
  BackButton,
  Spinner,
  BorderCard,
} from 'uikit';

import { Steps, Hints } from 'intro.js-react'; // 引入我们需要的组件
import 'intro.js/introjs.css';

import Layout from 'components/Layout';
import Dashboard from 'components/Dashboard';
import { GlobalVideo } from 'components/Video';
import useGame from 'game/hooks/useGame';
import Progress from 'components/Progress';
import Game from 'game/core/Game';
import { useStore, storeAction } from 'state';
import { RoundDescTotalHp } from 'game/types';
import { useToast } from 'contexts/ToastsContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'contexts/Localization';
import { useGuide } from 'hooks/useGuide';
import {
  useFetchGameMatchUser,
  useFetchGamePK,
  useFetchGamePKTest,
  useFetchGameTerrain,
} from 'state/game/hooks';
import { GamePkState } from 'state/types';
import useParsedQueryString from 'hooks/useParsedQueryString';
import { useDispatch } from 'react-redux';
import { APP_HEIGHT } from 'config';
import { TrackDetail } from 'game/core/Running';
import { useWeb3React } from '@web3-react/core';
import ModalWrapper from 'components/Modal';
import {
  PeopleCard,
  Energy,
  PKProgress,
  RoundPanel,
  WaitPlunderList,
  PlunderPanel,
  OtherDetail,
} from './components';
import { usePK } from './hooks/usePK';

// const game = new Game({ width: 1400, height: 600 });

// const GAME_LOAD_RATE = 0.9; // 加载进度条占的比值

const Pk = () => {
  useFetchGameTerrain();
  const { toastError } = useToast();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { account } = useWeb3React();

  const parseQs = useParsedQueryString();

  const matchAddress = String(parseQs.pid0);

  const { state, matchUser, mineUser } = useStore(p => p.game);

  const { TerrainInfo } = useStore(p => p.game);

  const { PKInfo, pkRes } = useStore(p => p.game);

  const [complete, setComplete] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [visibleGameFailed, setVisibleGameFailed] = useState(false);

  const [current, setCurrent] = useState(0);

  const ref = useRef<HTMLDivElement>(null);

  const game = useGame({ width: 1400, height: 500 });
  const [progress, setProgress] = useState(0);

  // 蓝色方和红色方信息
  useFetchGameMatchUser(account, 1);
  useFetchGameMatchUser(matchAddress);

  // TODO: 要干掉
  // useFetchGamePK(5000000000000004, 5000000000000002, 10);
  // useFetchGamePKTest(id, undefined, 30);

  const { initHandle, running } = usePK(game);

  const [roundInfo, setRoundInfo] = useState<TrackDetail | null>(null);
  const [roundInfos, setRoundInfos] = useState<TrackDetail[]>([]);
  const [others, setOthers] = useState<OtherDetail[]>([]);
  const [totalInfo, setTotalInfo] = useState<RoundDescTotalHp | null>(null);
  const [result, setResult] = useState<boolean[]>([]);

  const onRunningUpdate = useCallback(
    (event: Event) => {
      const { detail } = event as CustomEvent<TrackDetail>;
      if (detail) {
        setRoundInfos(prev => {
          // console.log(prev);
          if (
            !prev.find(
              item =>
                item.descInfo?.id === detail.descInfo?.id &&
                detail.descInfo?.id,
            )
          ) {
            // const { length } = prev;
            // // 大于20条就截取
            // return length >= 20 ? [...prev.slice(1, length), detail] : [...prev, detail];
            return [...prev, detail];
          }
          return prev;
        });
        setRoundInfo(detail);
        if (detail.info) {
          setTotalInfo(detail.info);
        }
      }
    },
    [setRoundInfo, setTotalInfo, setRoundInfos],
  );

  const newRoundHandle = useCallback(() => {
    console.log('重新开始');
    game.clearSoldier();
    setTotalInfo(null);
    setOthers([]);
    setRoundInfos([]);
    setMounted(false);
    setCurrent(prev => prev + 1);
  }, [setMounted, setTotalInfo, setCurrent, setOthers, setRoundInfos, game]);

  const onEndHandle = useCallback(() => {
    if (pkRes) {
      navigate('/plunder-result');
    } else {
      setVisibleGameFailed(true);
    }
  }, [pkRes, navigate]);

  const onRunEnd = useCallback(() => {
    const { success } = PKInfo[current];
    setResult(prev => {
      return [...prev, success];
    });
    // descType
    setOthers(prev => {
      return [
        ...prev,
        {
          id: 0,
          text: `本场战斗结束, 下场战斗即将开始`,
          type: 1,
          success,
          showResult: true,
        },
      ];
    });

    if (current < PKInfo?.length - 1) {
      const timer = setInterval(() => {
        setOthers(prev => {
          const { length } = prev;
          const index = 4 - length;
          if (index === 0) {
            clearInterval(timer);
            newRoundHandle();
            return prev;
          }
          return [
            ...prev,
            {
              id: length,
              text: `${index}`,
              type: 2,
            },
          ];
        });
      }, 1000);
      return;
    }
    onEndHandle();
  }, [setOthers, current, setResult, PKInfo, newRoundHandle, onEndHandle]);

  useEffect(() => {
    if (running) {
      running.addEventListener('updateTrack', onRunningUpdate);
      running.addEventListener('runEnd', onRunEnd);
    }
    return () => {
      if (running) {
        running.removeEventListener('updateTrack', onRunningUpdate);
        running.removeEventListener('runEnd', onRunEnd);
      }
    };
  }, [running, onRunningUpdate, onRunEnd]);

  useEffect(() => {
    if (game) {
      game.creatTerrain();
    }
  }, [game]);

  const location = useLocation();
  const { guides, setGuide } = useGuide(location.pathname);

  const { t } = useTranslation();

  // 控制是否开启新手指导的
  const [stepsEnabled, setStepsEnabled] = useState(true);
  const guideState = useStore(p => p.guide);
  const [activeStep, setActiveStep] = useState(guides.step);
  const steps = useMemo(
    () => [
      {
        element: '.plunder-pk-step0',
        intro: t('Here is your battle information.'),
      },
      {
        element: '.plunder-pk-step1',
        intro: t(
          'Here are all HP values of our camp. If it is empty, it will fail.',
        ),
      },
      {
        element: '.plunder-pk-step2',
        intro: t('Here is the basic information of the opponent.'),
      },
      {
        element: '.plunder-pk-step2-1',
        intro: t(
          'Here is the battle arrangement of both sides and the display of combat effects.',
        ),
      },
      {
        element: '.plunder-pk-step3',
        intro: t(
          'Here are the details of the battle report of the current battle process.',
        ),
      },
    ],
    [t],
  );

  const showGuide = useMemo(() => {
    return (
      !guides.guideFinish &&
      guides.finish &&
      steps.length - 1 > guides.step &&
      stepsEnabled
    );
  }, [guides, steps.length, stepsEnabled]);

  useEffect(() => {
    if (guideState.visible || showGuide) {
      running?.pause();
    } else {
      running?.play();
    }
  }, [showGuide, guideState.visible, running]);

  const [loaders, setLoaders] = useState(null);

  const loaderLoading = useCallback(
    event => {
      setProgress((event as ProgressEvent).loaded);
    },
    [setProgress],
  );

  const initPKHandle = useCallback(() => {
    try {
      initHandle(PKInfo[current]);
    } catch (error) {
      onRunEnd();
    }
  }, [initHandle, PKInfo, current, onRunEnd]);

  const loaderLoaded = useCallback(
    event => {
      setProgress(100);

      setComplete(true);
      initPKHandle();
    },
    [setProgress, setComplete, initPKHandle],
  );

  const loaderAddEventListener = useCallback(() => {
    const _loaders = game.loadResources();
    setLoaders(_loaders);
    _loaders.addEventListener('progress', loaderLoading);
    _loaders.addEventListener('complete', loaderLoaded);
  }, [loaderLoading, loaderLoaded, setLoaders, game]);

  const loaderRemoveEventListener = useCallback(() => {
    loaders?.removeEventListener('progress', loaderLoading);
    loaders?.removeEventListener('complete', loaderLoaded);
  }, [loaderLoading, loaderLoaded, loaders]);

  useEffect(() => {
    console.log(mounted);
    if (!mounted) {
      if (ref.current && game && PKInfo) {
        console.log(PKInfo);
        setTotalInfo(PKInfo[current].init.show_hp);
        setMounted(true);
        // 初始化
        if (current === 0) {
          ref.current.appendChild(game.view);
          loaderAddEventListener();
          // const loaders = game.loadResources();

          // loaders.addEventListener('progress', event => {
          //   console.log(
          //     (event as ProgressEvent).loaded,
          //     '(event as ProgressEvent).loaded',
          //   );
          //   setProgress((event as ProgressEvent).loaded);
          // });
          // loaders.addEventListener('complete', () => {
          //   setProgress(100);

          //   setComplete(true);
          //   initHandle(PKInfo[current]);
          // });
        } else if (current <= 5) {
          setComplete(true);
          initPKHandle();
        }
      } else {
        setTimeout(() => {
          alert(t('No combat information found'));
        }, 1000);
      }
    }

    return () => {
      if (!mounted) {
        loaderRemoveEventListener();
      }
    };
  }, [
    ref,
    game,
    setProgress,
    setMounted,
    mounted,
    setComplete,
    PKInfo,
    initPKHandle,
    current,
    loaderAddEventListener,
    loaderRemoveEventListener,
    t,
  ]);

  console.log(showGuide, stepsEnabled, 'showGuide');

  return (
    <Layout height={900}>
      {showGuide && (
        <Steps
          enabled={stepsEnabled}
          steps={steps}
          initialStep={guides.step}
          options={{
            exitOnOverlayClick: false,
            tooltipPosition: 'top',
          }}
          onChange={currentStep => {
            if (currentStep > guides.step) {
              setGuide(currentStep);
            }
          }}
          onBeforeChange={event => {
            setActiveStep(event);
          }}
          onExit={index => {
            setStepsEnabled(false);
            if (index < steps.length - 1) {
              dispatch(
                storeAction.toggleVisible({
                  visible: true,
                  lastStep: steps.length,
                }),
              );
            }
          }}
        />
      )}
      <Box
        position='absolute'
        width={800}
        height={480}
        top={50}
        right={0}
        className='plunder-pk-step2'
        zIndex={-1}
      />
      <Box
        position='absolute'
        width={900}
        height={500}
        top={0}
        right={0}
        left={0}
        bottom={0}
        margin='auto'
        className='plunder-pk-step2-1'
        zIndex={-1}
      />
      <Flex mb='20px'>
        <Flex position='relative' zIndex={1}>
          <BackButton ml='19px' />
          {/* <RefreshButton ml='33px' /> */}
        </Flex>
        <Fringe ml='-192px' />
        <Box />
      </Flex>
      <Flex>
        <Flex flexDirection='column' alignItems='center'>
          <PeopleCard
            className='plunder-pk-step0'
            mb='10px'
            active
            {...mineUser}
          />
          <Energy />
        </Flex>
        <Flex flex='1' flexDirection='column'>
          <Flex mt='-52px' justifyContent='space-between'>
            <PKProgress
              className='plunder-pk-step1'
              total={PKInfo?.[current]?.init?.show_hp?.blue_total_hp ?? 0}
              current={totalInfo?.blue_total_hp ?? 0}
              result={result}
            />
            <RoundPanel
              mt='-45px'
              roundName={roundInfo?.id}
              isEnemy={roundInfo?.descInfo?.sender?.isEnemy}
              onEnd={onEndHandle}
            />
            <PKProgress
              opponent
              result={result}
              isRed
              total={PKInfo?.[current]?.init?.show_hp?.red_total_hp ?? 0}
              current={totalInfo?.red_total_hp ?? 0}
            />
          </Flex>
          <Flex justifyContent='center' alignItems='center'>
            <Box ref={ref} />
          </Flex>
        </Flex>

        <Flex flexDirection='column' alignItems='center'>
          <PeopleCard mb='10px' {...matchUser} />
          <Energy />
        </Flex>
      </Flex>
      {PKInfo && (
        <Flex alignItems='center' margin=' 36px auto' width='900px'>
          <Box width='900px'>
            {progress < 100 && <Progress width={`${progress}%`} />}
          </Box>
          {/* <Text>{progress}</Text> */}
        </Flex>
      )}

      <Flex
        justifyContent='center'
        position='absolute'
        bottom='-1000px'
        width='100%'
        style={{
          transform: `translateZ(1px) translateY(${complete ? -960 : 0}px)`,
          transition: 'all 0.5s',
        }}
      >
        {/* <WaitPlunderList /> */}
        <Flex flex={1}>
          <PlunderPanel
            className='plunder-pk-step3'
            width='100%'
            details={roundInfos}
            others={others}
          />
        </Flex>
        {/* <WaitPlunderList /> */}
      </Flex>

      <ModalWrapper
        title={t('Game over')}
        visible={visibleGameFailed}
        setVisible={() => setVisibleGameFailed(false)}
      >
        <Flex pt='100px' flexDirection='column' alignItems='center'>
          <Text fontSize='30px' color='warning'>
            {t('Failed to plunder the planet!')}
          </Text>
          <Button mt='70px' onClick={() => navigate(-1)}>
            {t('Confirm')}
          </Button>
        </Flex>
      </ModalWrapper>
    </Layout>
  );
};

export default Pk;
