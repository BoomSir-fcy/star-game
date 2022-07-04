import React, { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Box, Flex, BackButton, RefreshButton } from 'uikit';

import useParsedQueryString from 'hooks/useParsedQueryString';
import { useTranslation } from 'contexts/Localization';
import { getPlanetAddress } from 'utils/addressHelpers';

import Nav from 'components/Nav';
import Layout from 'components/Layout';
import { fetchPlanetInfoAsync } from 'state/planet/fetchers';
import {
  fetchBuildingsListAsync,
  fetchPlanetBuildingsAsync,
} from 'state/buildling/fetchers';
import { setActiveNavId } from 'state/planet/actions';
import { useStore } from 'state';
import eventBus from 'utils/eventBus';
import { StarHeader } from './components';
import { BarRight, SideRightBuildingInfo } from './components/buildings';

const Star: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const parsedQs = useParsedQueryString();
  const id = Number(parsedQs.id);
  const { t } = useTranslation();
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
