import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Steps, Hints } from 'intro.js-react'; // 引入我们需要的组件
import 'intro.js/introjs.css';

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
import { useGuide } from 'hooks/useGuide';
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

  const { guides, setGuide } = useGuide('mystery-index');

  // 控制是否开启新手指导的
  const [stepsEnabled, setStepsEnabled] = useState(true);
  const [steps, setSteps] = useState([
    {
      element: '.mystery-detail-step0',
      intro:
        '太好了，恭喜获得第一个星球。这是星球的主宰种族，每个种族间有各自的特性。',
    },
    {
      element: '.mystery-detail-step1',
      intro: '这里是星球的属性信息，品质决定属性，格子数也决定了星球的建造数。',
    },
    {
      element: '.mystery-detail-step2',
      intro:
        '星球的额外属性信息，对整个星球的经营与战斗都有密切关系，可通过培育提升。',
    },
    {
      element: '.mystery-detail-step3',
      intro: '接下来让我们开始经营星球吧~',
    },
  ]);

  return (
    <Layout>
      {guides.finish && steps.length - 1 > guides.step && (
        <Steps
          enabled={stepsEnabled}
          steps={steps}
          initialStep={guides.step}
          options={{
            exitOnOverlayClick: false,
            tooltipPosition: 'top',
            scrollPadding: 0,
          }}
          onBeforeChange={event => {
            console.log(event);
          }}
          onExit={() => {
            setStepsEnabled(false);
          }}
        />
      )}
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
              <Race className='mystery-detail-step0' info={info} />
            </Attributes>
            <Extra info={info} ml='20px'>
              <Flex mt='30px' justifyContent='center'>
                <Button
                  className='mystery-detail-step3'
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
