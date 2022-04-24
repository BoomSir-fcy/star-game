import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Text,
  PrimaryInput,
  Button,
  Flex,
  RefreshButton,
  Spinner,
} from 'uikit';

import styled from 'styled-components';
import Dashboard from 'components/Dashboard';
import Layout from 'components/Layout';
import { useDispatch } from 'react-redux';
import useParsedQueryString from 'hooks/useParsedQueryString';
import { fetchPlanetInfoAsync } from 'state/planet/fetchers';
import { GamePkState } from 'state/types';
import { useStore } from 'state';
import { fetchUnitListAsync } from 'state/game/reducer';
import { GameBoard } from 'game';
import PeopleCard from './components/PeopleCard';
import VsVideo from './components/VsVideo';
import GamePK from './components/GamePK';

const Plunder = () => {
  const [state, setState] = useState(GamePkState.MATCHING);
  const dispatch = useDispatch();

  const parsedQs = useParsedQueryString();

  const [pid0, setPid0] = useState((parsedQs.pid0 as string) || '');
  const [pid1, setPid1] = useState('');

  const planetInfo = useStore(p => p.planet.planetInfo);

  const infoP0 = useMemo(() => {
    return planetInfo[Number(pid0)];
  }, [planetInfo, pid0]);

  const infoP1 = useMemo(() => {
    return planetInfo[Number(pid1)];
  }, [planetInfo, pid1]);

  useEffect(() => {
    if (infoP0?.race && infoP1?.race) {
      dispatch(fetchUnitListAsync(infoP0?.race));
      dispatch(fetchUnitListAsync(infoP1?.race));
    }
  }, [dispatch, infoP0?.race, infoP1?.race]);

  const startHandle = useCallback(() => {
    if (Number(pid0) && Number(pid1)) {
      dispatch(fetchPlanetInfoAsync([Number(pid0), Number(pid1)]));
    }
  }, [dispatch, pid0, pid1]);

  return (
    <Layout>
      <Dashboard />
      <GamePK pid0={infoP0?.id} pid1={infoP1?.id} />
    </Layout>
  );
};

export default Plunder;
