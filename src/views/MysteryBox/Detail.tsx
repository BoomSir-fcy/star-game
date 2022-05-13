import React, { useCallback, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Card, Text, Flex, BgCard, Label, Button } from 'uikit';
import Layout from 'components/Layout';
import Dashboard from 'components/Dashboard';
import {
  MysteryBoxStyled,
  MysteryBoxBaseStyled,
  MysteryBoxBoxStyled,
  mysteryBoxQualities,
} from 'components/MysteryBoxCom';
import StarCom from 'components/StarCom';
import { useStore } from 'state';
import { useDispatch } from 'react-redux';
import useParsedQueryString from 'hooks/useParsedQueryString';
import { fetchPlanetInfoAsync } from 'state/planet/fetchers';
import { useTranslation } from 'contexts/Localization';
import eventBus from 'utils/eventBus';
import Attributes from './components/Attributes';
import Extra from './components/Extra';
import Race from './components/Race';

const MysteryBox = styled(MysteryBoxStyled)`
  width: 435px;
  height: 583px;
  margin-left: 60px;
  margin-right: 80px;
`;
const MysteryBoxStarStyled = styled(MysteryBoxBoxStyled)`
  background: none;
`;
const StarLabelStyled = styled(Card)`
  position: absolute;
  width: 435px;
  height: 110px;
  bottom: 7px;
  left: 0;
  right: 0;
  margin: auto;
  padding: 10px 20px;
  z-index: 3;
`;

const MysteryBoxDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const paramsQs = useParsedQueryString();
  const id = Number(paramsQs.i);
  const { t } = useTranslation();

  const planetInfo = useStore(p => p.planet.planetInfo);

  const info = useMemo(() => {
    return planetInfo[id];
  }, [planetInfo, id]);

  useEffect(() => {
    if (id) dispatch(fetchPlanetInfoAsync([id]));
  }, [id, dispatch]);

  useEffect(() => {
    if (!info) {
      setTimeout(() => {
        dispatch(fetchPlanetInfoAsync([id]));
      }, 10000);
    }
  }, [info, id, dispatch]);

  const onRefreshClick = React.useCallback(() => {
    dispatch(fetchPlanetInfoAsync([id]));
  }, [dispatch, id]);

  // 添加事件监听，用于更新状态
  React.useEffect(() => {
    eventBus.addEventListener('onRefresh', onRefreshClick);
    return () => {
      eventBus.removeEventListener('onRefresh', onRefreshClick);
    };
  }, [onRefreshClick]);

  return (
    <Layout>
      <Flex>
        <MysteryBox>
          <MysteryBoxBaseStyled quality={mysteryBoxQualities.ORDINARY} />
          <MysteryBoxStarStyled quality={mysteryBoxQualities.ORDINARY}>
            <StarCom variant='none' scale='ld' />
          </MysteryBoxStarStyled>
          <StarLabelStyled>
            <Flex flexDirection='column' alignItems='center'>
              <Text ellipsis bold>
                {info?.name}
              </Text>
              <Text mt='10px' ellipsis small>
                <span>Token:</span> {info?.id}
              </Text>
            </Flex>
          </StarLabelStyled>
        </MysteryBox>
        <BgCard fringe variant='sFull'>
          <Flex padding='38px 53px' justifyContent='space-between'>
            <Attributes info={info}>
              <Race info={info} />
            </Attributes>
            <Extra info={info} ml='20px'>
              <Flex mt='30px' justifyContent='center'>
                <Button
                  variant='transparent'
                  onClick={() => {
                    navigate('/star/planet');
                    navigate(`/star?id=${id}`);
                  }}
                >
                  {t('Manage Planet')}
                </Button>
              </Flex>
            </Extra>
          </Flex>
        </BgCard>
      </Flex>
    </Layout>
  );
};

export default MysteryBoxDetail;
