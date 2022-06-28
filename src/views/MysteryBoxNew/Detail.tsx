import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Steps, Hints } from 'intro.js-react'; // 引入我们需要的组件
import 'intro.js/introjs.css';

import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Text, Flex, BgCard, Label, Button } from 'uikit';
import Layout from 'components/Layout';
import {
  MysteryBoxStyled,
  MysteryBoxBaseStyled,
  MysteryBoxBoxStyled,
  mysteryBoxQualities,
} from 'components/MysteryBoxCom';
import { Globe } from 'components';
import { useStore, storeAction } from 'state';
import { useDispatch } from 'react-redux';
import useParsedQueryString from 'hooks/useParsedQueryString';
import { useGuide } from 'hooks/useGuide';
import { fetchPlanetInfoAsync } from 'state/planet/fetchers';
import { useTranslation } from 'contexts/Localization';
import eventBus from 'utils/eventBus';
import { QualityColor } from 'uikit/theme/colors';
import { fetchUserProductAsync } from 'state/userInfo/reducer';
import Attributes from './components/Attributes';
import Race from './components/Race';

const MysteryBox = styled(MysteryBoxStyled)`
  width: 435px;
  height: 583px;
  margin-left: 60px;
  margin-right: 80px;
`;
const MysteryBoxStarStyled = styled(MysteryBoxBoxStyled)`
  background: none;
  top: 100px;
  left: 15px;
`;
const StarLabelStyled = styled(Card)`
  position: absolute;
  width: 333px;
  height: 90px;
  bottom: 7px;
  left: 0;
  right: 0;
  margin: auto;
  padding: 10px 20px;
  z-index: 3;
`;
const BgCardStyle = styled(BgCard)`
  width: 1006px;
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
    } else {
      dispatch(fetchUserProductAsync());
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
            <Globe
              rotate
              scale='ld'
              shadow={QualityColor[info?.rarity]}
              url={info?.picture1}
            />
          </MysteryBoxStarStyled>
          <StarLabelStyled>
            <Flex flexDirection='column' alignItems='center'>
              <Text color={QualityColor[info?.rarity]} fontSize='24px' bold>
                {info?.rarity ? t(`rarity-${info?.rarity}`) : ''}
              </Text>
              <Text ellipsis small>
                <span>Token:</span> {info?.id}
              </Text>
            </Flex>
          </StarLabelStyled>
        </MysteryBox>
        <BgCardStyle fringe variant='sFull'>
          <Flex padding='46px 39px' flexDirection='column'>
            <Race className='mystery-detail-step0' info={info} />
            <Attributes info={info} />
            <Flex mt='20px' justifyContent='center'>
              <Button
                width='348px'
                height='57px'
                className='mystery-detail-step3'
                variant='purple'
                onClick={() => {
                  navigate('/star/planet');
                  navigate(`/star?id=${id}`);
                }}
              >
                <Text fontSize='18px' bold>
                  {t('Manage Planet')}
                </Text>
              </Button>
            </Flex>
          </Flex>
        </BgCardStyle>
      </Flex>
    </Layout>
  );
};

export default MysteryBoxDetail;
