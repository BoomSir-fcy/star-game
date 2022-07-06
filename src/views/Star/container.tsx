import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Flex } from 'uikit';
import { useStore } from 'state';
import {
  fetchBuildingsListAsync,
  fetchPlanetBuildingsAsync,
} from 'state/buildling/fetchers';
import { fetchPlanetInfoAsync } from 'state/planet/fetchers';

import useParsedQueryString from 'hooks/useParsedQueryString';

import Layout from 'components/Layout';
import { BarRight } from './components/buildings';

const Star: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const parsedQs = useParsedQueryString();
  const id = Number(parsedQs.id);
  const planet = useStore(p => p.planet.planetInfo[id ?? 0]);
  const [positionTop, setPositionTop] = useState('0');

  React.useEffect(() => {
    if (id) {
      dispatch(fetchPlanetInfoAsync([id]));
      dispatch(fetchPlanetBuildingsAsync(id));
    }
  }, [id, dispatch]);

  React.useEffect(() => {
    if (id && planet?.race) {
      dispatch(
        fetchBuildingsListAsync({
          type: 1,
          race: planet?.race,
        }),
      );
    }
  }, [id, dispatch, planet?.race]);

  React.useEffect(() => {
    if (pathname.indexOf('/star/upgrade') !== -1) {
      setPositionTop('-30px');
    } else if (pathname.indexOf('/star/grow') !== -1) {
      setPositionTop('-30px');
    } else if (pathname.indexOf('/star/embattle') !== -1) {
      setPositionTop('-38px');
    } else {
      setPositionTop('69px');
    }
  }, [pathname]);

  return (
    <Layout>
      <BarRight top={positionTop} planet_id={id} />
      <Flex width='100%'>{children}</Flex>
    </Layout>
  );
};

export default Star;
