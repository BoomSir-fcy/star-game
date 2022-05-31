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
import { useNavigate } from 'react-router-dom';
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
import { TrackDetail } from 'game/core/Running';
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

  const parseQs = useParsedQueryString();

  const id = Number(parseQs.pid0) || 5000000000000040;

  const { state, matchUser, mineUser } = useStore(p => p.game);

  const { TerrainInfo } = useStore(p => p.game);

  const PKInfo = useStore(p => p.game.PKInfo);

  const [complete, setComplete] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [current, setCurrent] = useState(0);

  const ref = useRef<HTMLDivElement>(null);

  const game = useGame({ width: 1400, height: 600 });
  const [progress, setProgress] = useState(0);

  // TODO: 要干掉
  // useFetchGamePK(5000000000000004, 5000000000000002, 10);
  // useFetchGamePKTest(id, undefined, 30);

  const { initHandle, running } = usePK(game);

  const [roundInfo, setRoundInfo] = useState<TrackDetail | null>(null);
  const [roundInfos, setRoundInfos] = useState<TrackDetail[]>([]);
  const [others, setOthers] = useState<OtherDetail[]>([]);
  const [totalInfo, setTotalInfo] = useState<RoundDescTotalHp | null>(null);
  const [result, setResult] = useState<boolean[]>([]);

  useEffect(() => {
    if (!mounted) {
      if (ref.current && game && PKInfo) {
        console.log(PKInfo);
        setTotalInfo(PKInfo[current].init.show_hp);
        setMounted(true);
        // 初始化
        if (current === 0) {
          ref.current.appendChild(game.view);
          const loaders = game.loadResources();
          loaders.addEventListener('progress', event => {
            setProgress((event as ProgressEvent).loaded);
          });
          loaders.addEventListener('complete', () => {
            setComplete(true);
            initHandle(PKInfo[current]);
          });
        } else if (current <= 5) {
          setComplete(true);
          initHandle(PKInfo[current]);
        }
      } else {
        setTimeout(() => {
          // alert('未查询到作战信息');
        }, 1000);
      }
    }
  }, [
    ref,
    game,
    setProgress,
    setMounted,
    mounted,
    setComplete,
    PKInfo,
    initHandle,
    current,
  ]);

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
    navigate('/plunder-result');
  }, [navigate]);

  const onRunEnd = useCallback(() => {
    const res = Math.random() > 0.5;
    console.log('结束了 一切都结束了', PKInfo[current].success);
    setResult(prev => {
      return [...prev, res];
    });
    // descType
    setOthers(prev => {
      return [
        ...prev,
        {
          id: 0,
          text: '本场战斗结束',
          type: 1,
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
    }

    // 游戏结束
  }, [setOthers, current, setResult, PKInfo, newRoundHandle]);

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
    if (TerrainInfo?.length) {
      game.creatTerrain(TerrainInfo[0].terrains);
    } else {
      game.creatTerrain([]);
    }
  }, [TerrainInfo, game]);

  const { guides, setGuide } = useGuide('plunder-pk');

  const { t } = useTranslation();

  // 控制是否开启新手指导的
  const [stepsEnabled, setStepsEnabled] = useState(true);
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
        element: '.plunder-pk-step3',
        intro: t(
          'Here are the details of the battle report of the current battle process.',
        ),
      },
    ],
    [t],
  );

  return (
    <Layout>
      {!guides.guideFinish && guides.finish && steps.length - 1 > guides.step && (
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
            if (index < steps.length) {
              dispatch(storeAction.toggleVisible({ visible: true }));
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
            <Progress width={`${progress}%`} />
          </Box>
          <Text>{progress}</Text>
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
    </Layout>
  );
};

export default Pk;
