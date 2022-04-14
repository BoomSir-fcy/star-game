import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from 'components/Layout';
import Dashboard from 'components/Dashboard';
import Nav from 'components/Nav';
import { BgCard, Flex, Text, Button, Card, Image, Spinner } from 'uikit';
import styled from 'styled-components';
import { useStore } from 'state';
import { useGalaxyList } from 'state/galaxy/hooks';
import { useDispatch } from 'react-redux';
import {
  fetchGalaxyListAsync,
  fetchGalaxyStarListAsync,
  setCurrentGalaxy,
} from 'state/galaxy/reducer';
import { shortenAddress } from 'utils';
import { toast } from 'react-toastify';
import { StarLevelInfo } from 'state/types';
import { useWeb3React } from '@web3-react/core';
import { useTranslation } from 'contexts/Localization';
import { GalaxyImage } from './components/GalaxyImage';
import { Rewards } from './Rewards';

const StyledCard = styled(Card)`
  width: 977px;
  height: 476px;
  margin-left: 40px;
  padding: 20px 67px;
`;

const Galaxy = () => {
  useGalaxyList();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const { galaxyList, currentGalaxy, loadingGalaxy } = useStore(p => p.galaxy);
  const [navList, setNavList] = useState<StarLevelInfo[]>([]);

  const initList = useCallback(() => {
    const list = galaxyList.map((item: any) => {
      return {
        ...item,
        label: item.name,
        badge: item.owner?.toLowerCase() === account?.toLowerCase(),
      };
    });
    setNavList(list);
    dispatch(
      setCurrentGalaxy(
        currentGalaxy.id ? list.find(v => v.id === currentGalaxy.id) : list[0],
      ),
    );
  }, [galaxyList, account, currentGalaxy.id]);

  useEffect(() => {
    initList();
  }, [initList]);

  return (
    <Layout>
      <Dashboard
        onRefresh={async () => {
          dispatch(fetchGalaxyListAsync());
        }}
      />
      {!loadingGalaxy ? (
        <Flex alignItems='center'>
          <Nav
            nav={navList}
            mr='24px'
            activeId={currentGalaxy?.id}
            onChangeNav={item => {
              dispatch(setCurrentGalaxy(item));
              dispatch(fetchGalaxyStarListAsync(item.id as number));
            }}
          />
          <BgCard padding='30px' variant='medium' fringe>
            <Flex alignItems='center'>
              <GalaxyImage width={516} height={516} />
              <StyledCard>
                <Flex flexDirection='column' justifyContent='space-between'>
                  <Flex flexDirection='column'>
                    <Text mt='10px' fontSize='24px'>
                      {t('Galaxy Lord: %name% (can be obtained by auction)', {
                        name: currentGalaxy?.nickname || t('none'),
                      })}
                    </Text>
                    <Text mt='10px' fontSize='24px'>
                      {t(
                        'Galaxy Rewards: 10000 STAR (distributed every 24:00 UTC)',
                      )}
                    </Text>
                    <Text mt='10px' fontSize='24px'>
                      Token: {currentGalaxy?.id}
                    </Text>
                    <Rewards mt='20px' t={t} galaxy_id={currentGalaxy?.id} />
                  </Flex>
                  <Flex mt='40px' justifyContent='space-between'>
                    <Button
                      as={Link}
                      to={`/galaxy/auction?i=${currentGalaxy?.id}`}
                    >
                      {t('Galaxy Auction')}
                    </Button>
                    <Button
                      as={Link}
                      to={`/galaxy/stars?i=${currentGalaxy?.id}`}
                    >
                      {t('Occupy the stars')}
                    </Button>
                  </Flex>
                </Flex>
              </StyledCard>
            </Flex>
          </BgCard>
        </Flex>
      ) : (
        <Spinner />
      )}
    </Layout>
  );
};

export default Galaxy;
