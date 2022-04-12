import React from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Box, Flex, BackButton, RefreshButton } from 'uikit';

import useParsedQueryString from 'hooks/useParsedQueryString';
import { useTranslation } from 'contexts/Localization';

import Nav from 'components/Nav';
import Layout from 'components/Layout';
import { fetchPlanetInfoAsync } from 'state/planet/fetchers';
import {
  fetchBuildingsListAsync,
  fetchPlanetBuildingsAsync,
} from 'state/buildling/fetchers';
import { StarHeader } from './components';

const Star: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const dispatch = useDispatch();
  const parsedQs = useParsedQueryString();
  const { t } = useTranslation();
  const id = Number(parsedQs.id);

  React.useEffect(() => {
    if (id) {
      dispatch(fetchPlanetInfoAsync([id]));
      dispatch(fetchPlanetBuildingsAsync(id));
      dispatch(fetchBuildingsListAsync(1));
    }
  }, [id, dispatch]);

  return (
    <Layout>
      <Flex padding='0 20px' mb='16px' justifyContent='space-between' flex={1}>
        <Box>
          <BackButton />
          <RefreshButton ml='33px' />
        </Box>
        <StarHeader />
      </Flex>
      <Flex width='100%'>
        <Nav
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
              id: 'search',
              label: `${t('planetMenuLooting')}`,
              path: `/star/search?id=${parsedQs.id}`,
            },
          ]}
        />
        <Flex ml='23px' flex={1}>
          {children}
        </Flex>
      </Flex>
    </Layout>
  );
};

export default Star;
