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
import Game from 'game/core/Game';
import { useStore } from 'state';
import { useFetchGameTerrain } from 'state/game/hooks';
import { States } from './types';
import {
  PeopleCard,
  Energy,
  PKProgress,
  RoundPanel,
  WaitPlunderList,
  PlunderPanel,
} from './components';

const game = new Game({ width: 900, height: 600 });

const Pk = () => {
  useFetchGameTerrain();

  const { TerrainInfo } = useStore(p => p.game);

  const [state, setState] = useState(States.MATCHING);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.appendChild(game.view);
    }
  }, [ref]);

  useEffect(() => {
    game.creatTerrain(TerrainInfo[0].terrains);
  }, [TerrainInfo]);

  return (
    <Layout>
      <Flex mb='20px'>
        <Flex>
          <BackButton ml='19px' />
          <RefreshButton ml='33px' />
        </Flex>
        <Fringe ml='-192px' />
        <Box />
      </Flex>
      <Flex>
        <Flex flexDirection='column' alignItems='center'>
          <PeopleCard mb='10px' active />
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
          <PeopleCard mb='10px' />
          <Energy />
        </Flex>
      </Flex>
      <Flex
        mt='-50px'
        justifyContent='space-between'
        style={{ transform: 'translateZ(1px)' }}
      >
        <WaitPlunderList />
        <PlunderPanel />
        <WaitPlunderList />
      </Flex>
    </Layout>
  );
};

export default Pk;
