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
    if (pathname.indexOf('/star/') === -1) {
      console.log('建造页面');
      setPositionTop('8%');
    } else if (pathname.indexOf('/star/grow') !== -1) {
      setPositionTop('1%');
    } else {
      console.log('其他页面');
      setPositionTop('-4%');
    }
  }, [pathname]);

  return (
    <Layout>
      {/* <Flex padding='0 20px' mb='16px' justifyContent='space-between' flex={1}>
        <Box>
          <BackButton />
          <RefreshButton
            onRefresh={() => {
              eventBus.dispatchEvent(new MessageEvent('onRefresh'));
            }}
            ml='33px'
          />
        </Box>
        <StarHeader />
      </Flex> */}
      <BarRight top={positionTop} planet_id={id} />
      <Flex width='100%'>{children}</Flex>
      {/* <Flex width='100%'>
        <Nav
          className='common_nav'
          nav={[
            {
              id: 'build',
              label: `${t('planetMenuBuilding')}`,
              path: `/star?id=${parsedQs.id}`,
            },
            {
              id: 'upgrade',
              label: `${t('planetMenuUpgrade')}`,
              path: `/star/upgrade?id=${parsedQs.id}`,
            },
            {
              id: 'grow',
              label: `${t('planetMenuGrow')}`,
              path: `/star/grow?id=${parsedQs.id}`,
            },
            {
              id: 'embattle',
              label: `${t('planetMenuEmbattle')}`,
              path: `/star/embattle?id=${parsedQs.id}`,
            },
            {
              id: 'embattle-test',
              label: `${t('测试摆盘')}`,
              path: `/star/embattle-test?id=${parsedQs.id}`,
            },
            {
              id: 'Marketplace',
              label: `${t('Marketplace')}`,
              external: true,
              path: `${
                process.env.REACT_APP_WEB_LINK
              }/nftdetail/bag/${getPlanetAddress()}/${parsedQs.id}`,
            },
          ]}
          activeId={activeNavId}
          onChangeNav={e => {
            dispatch(setActiveNavId(e.id as string));
          }}
        />
        <Flex ml='23px' flex={1}>
          {children}
        </Flex>
      </Flex> */}
    </Layout>
  );
};

export default Star;
