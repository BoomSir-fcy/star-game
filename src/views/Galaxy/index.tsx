import React, { useCallback, useEffect, useMemo } from 'react';
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
  fetchGalaxyStarListAsync,
  setCurrentGalaxy,
} from 'state/galaxy/reducer';
import { shortenAddress } from 'utils';
import { toast } from 'react-toastify';
import { useWeb3React } from '@web3-react/core';
import { GalaxyImage } from './components/GalaxyImage';

const StyledCard = styled(Card)`
  width: 977px;
  height: 476px;
  margin-left: 40px;
  padding: 56px 67px;
`;

const Galaxy = () => {
  useGalaxyList();
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const { galaxyList, currentGalaxy, loading } = useStore(p => p.galaxy);

  const navList = useMemo(() => {
    return galaxyList.map((item: any) => {
      return {
        ...item,
        label: item.name,
        badge: item.owner?.toLowerCase() === account?.toLowerCase(),
      };
    });
  }, [galaxyList, account]);

  const getStarList = useCallback(() => {
    if (galaxyList[0]?.id) {
      dispatch(setCurrentGalaxy(galaxyList[0]));
      dispatch(fetchGalaxyStarListAsync(galaxyList[0].id));
    }
  }, [galaxyList, dispatch]);

  useEffect(() => {
    getStarList();
  }, [getStarList]);

  return (
    <Layout>
      <Dashboard />
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
                  <Text fontSize='24px'>
                    恒星数： {currentGalaxy?.starTotal}个（已被占领：
                    {currentGalaxy?.starOwnerTotal}）
                  </Text>
                  <Text mt='10px' fontSize='24px'>
                    星系主：
                    {currentGalaxy?.nickname || '无'}
                    （可竞拍获得）
                  </Text>
                  <Text mt='10px' fontSize='24px'>
                    星系奖励： 10000 STAR（每UTC 24点派发）
                  </Text>
                  <Text mt='10px' fontSize='24px'>
                    剩余可领取奖励时间(UTC 24)： 10h:10m:10s
                  </Text>
                </Flex>
                <Flex mt='100px' justifyContent='space-between'>
                  <Button
                    as={Link}
                    to={`/galaxy/auction?i=${currentGalaxy?.id}`}
                  >
                    星系竞拍
                  </Button>
                  <Button as={Link} to={`/galaxy/stars?i=${currentGalaxy?.id}`}>
                    占领恒星
                  </Button>
                </Flex>
              </Flex>
            </StyledCard>
          </Flex>
        </BgCard>
      </Flex>
    </Layout>
  );
};

export default Galaxy;
