import React, { useState, useRef, useEffect, useCallback } from 'react';
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
import styled from 'styled-components';
import Layout from 'components/Layout';
import Dashboard from 'components/Dashboard';
import { GlobalVideo } from 'components/Video';
import useGame from 'game/hooks/useGame';
import Progress from 'components/Progress';
import Game from 'game/core/Game';
import { useStore } from 'state';
import { RoundDescTotalHp } from 'game/types';
import { useToast } from 'contexts/ToastsContext';
import {
  useFetchGameMatchUser,
  useFetchGamePK,
  useFetchGamePKTest,
  useFetchGameTerrain,
} from 'state/game/hooks';
import { GamePkState } from 'state/types';
import useParsedQueryString from 'hooks/useParsedQueryString';
import { TrackDetail } from 'game/core/Running';
import {
  PeopleCard,
  Energy,
  PKProgress,
  RoundPanel,
  WaitPlunderList,
  PlunderPanel,
} from './components';
import usePlunder from './hooks/usePlunder';
import { usePK } from './hooks/usePK';

// const game = new Game({ width: 1400, height: 600 });

// const GAME_LOAD_RATE = 0.9; // 加载进度条占的比值

const Pk = () => {
  useFetchGameTerrain();
  const { toastError } = useToast();

  const { state, matchUser, mineUser } = useStore(p => p.game);

  const { TerrainInfo } = useStore(p => p.game);

  const PKInfo = useStore(p => p.game.PKInfo);

  const [complete, setComplete] = useState(false);
  const [mounted, setMounted] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  const game = useGame({ width: 1400, height: 600 });
  const [progress, setProgress] = useState(0);

  // TODO: 要干掉
  // useFetchGamePK(5000000000000004, 5000000000000002, 10);
  useFetchGamePKTest(5000000000000040, undefined, 10);

  console.log(PKInfo);

  const { initHandle, running } = usePK(game);

  const [roundInfo, setRoundInfo] = useState<TrackDetail | null>(null);
  const [totalInfo, setTotalInfo] = useState<RoundDescTotalHp | null>(null);

  useEffect(() => {
    if (!mounted) {
      if (ref.current && game && PKInfo) {
        console.log(121221);
        setTotalInfo(PKInfo.init.show_hp);
        setMounted(true);
        ref.current.appendChild(game.view);
        const loaders = game.loadResources();
        loaders.addEventListener('progress', event => {
          setProgress((event as ProgressEvent).loaded);
        });
        loaders.addEventListener('complete', () => {
          setComplete(true);
          initHandle(PKInfo);
        });
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
  ]);

  const onRunningUpdate = useCallback(
    (event: Event) => {
      // console.log(event);
      const { detail } = event as CustomEvent<TrackDetail>;
      if (detail) {
        setRoundInfo(detail);
        if (detail.info) {
          console.log(detail.info);
          setTotalInfo(detail.info);
        }
      }
    },
    [setRoundInfo, setTotalInfo],
  );

  useEffect(() => {
    if (running) {
      running.addEventListener('updateTrack', onRunningUpdate);
    }
    return () => {
      if (running) {
        running.removeEventListener('updateTrack', onRunningUpdate);
      }
    };
  }, [running, onRunningUpdate]);

  useEffect(() => {
    if (TerrainInfo?.length) {
      game.creatTerrain(TerrainInfo[0].terrains);
    } else {
      game.creatTerrain([]);
    }
  }, [TerrainInfo, game]);

  return (
    <Layout>
      <Flex mb='20px'>
        <Flex position='relative' zIndex={1}>
          <BackButton ml='19px' />
          <RefreshButton ml='33px' />
        </Flex>
        <Fringe ml='-192px' />
        <Box />
      </Flex>
      <Flex>
        <Flex flexDirection='column' alignItems='center'>
          <PeopleCard mb='10px' active {...mineUser} />
          <Energy />
        </Flex>
        <Flex flex='1' flexDirection='column'>
          <Flex mt='-52px' justifyContent='space-between'>
            <PKProgress
              total={PKInfo?.init?.show_hp?.blue_total_hp}
              current={totalInfo?.blue_total_hp}
            />
            <RoundPanel mt='-45px' roundName={roundInfo?.id} />
            <PKProgress
              opponent
              total={PKInfo?.init?.show_hp?.red_total_hp}
              current={totalInfo?.red_total_hp}
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
        justifyContent='space-between'
        position='absolute'
        bottom='-1000px'
        style={{
          transform: `translateZ(1px) translateY(${complete ? -960 : 0}px)`,
          transition: 'all 0.5s',
        }}
      >
        <WaitPlunderList />
        <PlunderPanel />
        <WaitPlunderList />
      </Flex>
    </Layout>
  );
};

export default Pk;
