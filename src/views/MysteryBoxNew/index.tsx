import React, { useMemo, useState } from 'react';
import { Layout } from 'components';
import { Flex, Box, Text } from 'uikit';
import styled, { createGlobalStyle } from 'styled-components';
import { GlobalVideo } from 'components/Video';
import { storeAction, useStore } from 'state';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  MysteryBoxCom,
  mysteryBoxQualities,
} from 'components/MysteryBoxComNew';
import { useTranslation } from 'contexts/Localization';
import { useFetchBoxView } from 'state/mysteryBox/hooks';
import BigNumber from 'bignumber.js';
import { useWeb3React } from '@web3-react/core';
import { useDispatch } from 'react-redux';
import { fetchBoxViewAsync } from 'state/mysteryBox/reducer';
import eventBus from 'utils/eventBus';
import { useGuide } from 'hooks/useGuide';
import { Steps } from 'intro.js-react';
import 'intro.js/introjs.css';
import BlindInfo from './BlindInfo';

const GlobalStyle = createGlobalStyle<{
  interactive?: boolean;
  noSelectBox?: boolean;
}>`
  ${({ interactive }) => {
    return interactive
      ? `
    *{
      pointer-events: none;
    }
    .introjs-showElement, .introjs-showElement *, .introjs-tooltip, .introjs-tooltip *{
      pointer-events: auto;
    }
    `
      : '';
  }};
  ${({ noSelectBox }) => {
    return noSelectBox
      ? `
      .introjs-helperLayer{
        border: none;
        width: 0 !important;
        height: 0 !important;
      }
    `
      : '';
  }}
`;
const ClickBox = styled(Box)`
  /* background-color: pink; */
  opacity: 0.2;
  width: 900px;
  height: 300px;
  transform: rotate(-45deg);
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto;
  /* cursor: pointer; */
`;
const VipBox = styled(Box)`
  position: absolute;
  top: -286px;
  width: 193px;
  height: 420px;
  background: url(/images/commons/nav/left.png) no-repeat;
  /* background-size: 100% 100%; */
  background-position: right top;
`;
const Title = styled(Text)`
  font-weight: bold;
  font-size: 22px;
  color: #ffffff;
  line-height: 1;
  background: linear-gradient(
    130deg,
    #fbeeba 0%,
    #f1d37e 14.990234375%,
    #d1ab64 33.0078125%,
    #d5c089 48.9990234375%,
    #d5bf86 66.9921875%,
    #f4d784 84.0087890625%,
    #fbeeba 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const PageTitle = styled(Box)`
  position: fixed;
  top: -460px;
  left: 930px;
  width: 600px;
`;

const SurprisesBox = styled(Box)`
  position: fixed;
  top: -360px;
  right: 0;
  width: 260px;
  border-radius: 10px;
  background: #43434380;
  padding: 18px;
`;

const MysteryBoxNew = () => {
  useFetchBoxView();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const { maxSales, sold } = useStore(p => p.mysteryBox.boxView);

  // 控制是否开启新手指导的
  const location = useLocation();
  const { guides, setGuide } = useGuide(location.pathname);
  const [stepsEnabled, setStepsEnabled] = useState(true);
  const [activeStep, setActiveStep] = useState(guides.step);

  const steps = useMemo(() => {
    return [
      {
        element: '.mystery-index-step0',
        intro: t('GuideMysteryIndexStep0'),
        noSelectBox: true,
      },
      {
        element: '.mystery-index-step1',
        intro: t('GuideMysteryIndexStep1'),
        interactive: true,
      },
    ];
  }, [t]);

  React.useEffect(() => {
    return () => {
      dispatch(storeAction.toggleVisible({ visible: false }));
    };
  }, [dispatch]);

  const onRefreshClick = React.useCallback(() => {
    dispatch(fetchBoxViewAsync(account));
  }, [account, dispatch]);

  // 监听刷新事件
  React.useEffect(() => {
    eventBus.addEventListener('onRefresh', onRefreshClick);
    return () => {
      eventBus.removeEventListener('onRefresh', onRefreshClick);
    };
  }, [onRefreshClick]);

  return (
    <Layout>
      {!guides.guideFinish && guides.finish && steps.length - 1 > guides.step && (
        <>
          <GlobalStyle
            interactive={steps[activeStep]?.interactive && stepsEnabled}
            noSelectBox={steps[activeStep]?.noSelectBox}
          />
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
              setActiveStep(event);
            }}
            onExit={index => {
              setStepsEnabled(false);
              if (index < steps.length - 1) {
                dispatch(
                  storeAction.toggleVisible({
                    visible: true,
                    lastStep: steps.length,
                  }),
                );
              }
            }}
          />
        </>
      )}
      <Box
        className='mystery-index-step0'
        width={0}
        height={0}
        position='absolute'
        top='-100px'
        left='30%'
      />
      <Flex position='relative'>
        {/* <VipBox>
          <Flex width='80%' mt='60px' pl='10px' flexDirection='column'>
            <Text fontSize='20px'>{t('Max sales: ')}&nbsp;</Text>
            <Title>{new BigNumber(maxSales).toNumber()}</Title>
          </Flex>
          <Flex width='80%' mt='15px' pl='10px' flexDirection='column'>
            <Text fontSize='20px'>{t('Sold: ')}&nbsp;</Text>
            <Title>{new BigNumber(sold).toNumber()}</Title>
          </Flex>
        </VipBox> */}
        <Flex
          position='relative'
          width='100%'
          height='100%'
          id='test'
          justifyContent='space-between'
        >
          <ClickBox
            left={-100}
            // onClick={() => {
            //   navigate(`/mystery-box/state?q=${mysteryBoxQualities.ORDINARY}`);
            // }}
          >
            <Box
              className='mystery-index-step1'
              position='absolute'
              width={700}
              height={400}
              left={100}
              top={0}
              bottom={0}
              style={{ transform: 'rotate(45deg)' }}
            />
          </ClickBox>
          <ClickBox
            left={450}
            // onClick={() => {
            //   navigate(`/mystery-box/state?q=${mysteryBoxQualities.ADVANCED}`);
            // }}
          />
          <ClickBox
            left={1050}
            // onClick={() => {
            //   navigate(`/mystery-box/state?q=${mysteryBoxQualities.SUPER}`);
            // }}
          />

          <MysteryBoxCom
            left={-50}
            top={-200}
            bottom={0}
            quality={mysteryBoxQualities.ORDINARY}
          />
          <MysteryBoxCom
            left={500}
            top={-200}
            bottom={0}
            quality={mysteryBoxQualities.ADVANCED}
          />
          <MysteryBoxCom
            left={1100}
            top={-200}
            bottom={0}
            quality={mysteryBoxQualities.SUPER}
          />
        </Flex>
      </Flex>
      <Flex position='fixed' bottom={-300}>
        <BlindInfo quality={mysteryBoxQualities.ORDINARY} />
        <BlindInfo quality={mysteryBoxQualities.ADVANCED} />
        <BlindInfo quality={mysteryBoxQualities.SUPER} />
      </Flex>
      <PageTitle>
        <Text
          mb='16px'
          fontSize='38px'
          padding={0}
          fontStyle='normal'
          bold
          mark
        >
          {t('Discover')}
        </Text>
        <Text mb='10px' bold>
          {t('OpenMysteryBoxDesc1')}
        </Text>
        <Text bold>{t('OpenMysteryBoxDesc1-2')}</Text>
      </PageTitle>
      <SurprisesBox>
        <Text mb='10px' bold>
          {t('Notice')}
        </Text>
        <Text mb='10px' bold>
          {t('SurprisesDesc1')}
        </Text>
        <Text fontSize='20px' color='#FFD63E' mb='6px' bold>
          {t('SurprisesDesc2')}
        </Text>
        <Text fontSize='20px' color='#FF02C5' bold>
          {t('SurprisesDesc3')}
        </Text>
      </SurprisesBox>
    </Layout>
  );
};

export default MysteryBoxNew;
