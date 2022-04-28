import React, { useState, useRef, useEffect } from 'react';
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
import { useToast } from 'contexts/ToastsContext';
import { useFetchGameMatchUser, useFetchGameTerrain } from 'state/game/hooks';
import { GamePkState } from 'state/types';
import useParsedQueryString from 'hooks/useParsedQueryString';
import {
  PeopleCard,
  Energy,
  PKProgress,
  RoundPanel,
  WaitPlunderList,
  PlunderPanel,
} from './components';
import usePlunder from './hooks/usePlunder';

// const game = new Game({ width: 1400, height: 600 });

// const GAME_LOAD_RATE = 0.9; // 加载进度条占的比值

const Pk = () => {
  useFetchGameTerrain();
  const { toastError } = useToast();

  const { state, matchUser, mineUser } = useStore(p => p.game);

  const { TerrainInfo } = useStore(p => p.game);

  const PKInfo = useStore(p => p.game.PKInfo);

  const [complete, setComplete] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  const game = useGame({ width: 1400, height: 600 });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (ref.current && game && PKInfo) {
      ref.current.appendChild(game.view);
      const loaders = game.loadResources();
      loaders.addEventListener('progress', event => {
        setProgress((event as ProgressEvent).loaded);
      });
      loaders.addEventListener('complete', () => {
        setComplete(true);
      });
    } else {
      setTimeout(() => {
        alert('未查询到作战信息');
      }, 1000);
    }
  }, [ref, game, setProgress, setComplete, PKInfo]);

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
            <PKProgress />
            <RoundPanel mt='-45px' />
            <PKProgress opponent />
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
