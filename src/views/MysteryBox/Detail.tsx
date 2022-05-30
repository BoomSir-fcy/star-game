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
import { useStore, storeAction } from 'state';
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

  const { guides, setGuide } = useGuide('mystery-box/detail');

  // 控制是否开启新手指导的
  const [stepsEnabled, setStepsEnabled] = useState(true);
  const steps = useMemo(
    () => [
      {
        element: '.mystery-detail-step0',
        intro: t(
          'Great. Congratulations on your first planet. This is the dominant race of the planet, and each race has its own characteristics.',
        ),
      },
      {
        element: '.mystery-detail-step1',
        intro: t(
          'Here is the attribute information of the planet. The quality determines the attribute, and the number of grids also determines the number of planets built.',
        ),
      },
      // {
      //   element: '.mystery-detail-step2',
      //   intro: t(
      //     'The additional attribute information of the planet is closely related to the operation and combat of the whole planet, which can be improved through cultivation.',
      //   ),
      // },
      {
        element: '.mystery-detail-step3',
        intro: t("Now let's start running the planet~"),
      },
    ],
    [t],
  );

  React.useEffect(() => {
    return () => {
      dispatch(storeAction.toggleVisible({ visible: false }));
    };
  }, [dispatch]);

  return (
    <Layout>
      {!guides.guideFinish && guides.finish && steps.length - 1 > guides.step && (
        <Steps
          enabled={stepsEnabled}
          steps={steps}
          initialStep={guides.step}
          options={{
            exitOnOverlayClick: false,
            tooltipPosition: 'top',
            scrollPadding: 0,
          }}
          onChange={currentStep => {
            if (currentStep > guides.step) {
              setGuide(currentStep);
            }
          }}
          onBeforeChange={event => {
            console.log(event);
          }}
          onExit={index => {
            setStepsEnabled(false);
            if (index < steps.length) {
              dispatch(storeAction.toggleVisible({ visible: true }));
            }
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
          <Flex padding='43px 37px' flexDirection='column'>
            <Attributes info={info}>
              <Race className='mystery-detail-step0' info={info} />
            </Attributes>
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
          </Flex>
        </BgCard>
        {/* <BgCard fringe variant='sFull'>
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
        </BgCard> */}
      </Flex>
    </Layout>
  );
};

export default MysteryBoxDetail;
