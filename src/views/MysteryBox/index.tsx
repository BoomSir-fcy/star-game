import React, { useMemo, useState } from 'react';

import { Steps, Hints } from 'intro.js-react'; // 引入我们需要的组件
import 'intro.js/introjs.css';

import { Box, Text, BgCard, Flex, TweenText } from 'uikit';
import { Link, useLocation } from 'react-router-dom';
import Layout from 'components/Layout';
import { MysteryBoxCom, mysteryBoxQualities } from 'components/MysteryBoxCom';
import { useFetchBoxView } from 'state/mysteryBox/hooks';
import { useGuide } from 'hooks/useGuide';
import styled, { createGlobalStyle } from 'styled-components';
import { useDispatch } from 'react-redux';
import { storeAction, useStore } from 'state';
import { useTranslation } from 'contexts/Localization';
import BigNumber from 'bignumber.js';

const GlobalStyle = createGlobalStyle<{ interactive?: boolean }>`
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
  
`;
const VipBox = styled(Box)`
  background: url(/images/commons/nav/left.png) no-repeat;
  /* background-size: 100% 100%; */
  width: 193px;
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

const MysteryBox = () => {
  useFetchBoxView();

  const location = useLocation();
  const { guides, setGuide } = useGuide(location.pathname);
  const dispatch = useDispatch();

  const { maxSales, sold } = useStore(p => p.mysteryBox.boxView);

  // 控制是否开启新手指导的
  const [stepsEnabled, setStepsEnabled] = useState(true);
  const [activeStep, setActiveStep] = useState(guides.step);
  // const [steps, setSteps] = useState([
  //   {
  //     element: '.mystery-index-step0',
  //     intro:
  //       'Commander! To start a journey to the planet, you need to have your own planet. The following box can open planets of different quality, and the quality of the planet determines the comprehensive strength.',
  //   },
  //   {
  //     element: '.mystery-index-step1',
  //     intro: '让我们开启第一个星球吧',
  //     interactive: true,
  //   },
  // ]);

  const { t } = useTranslation();

  const steps = useMemo(() => {
    return [
      {
        element: '.mystery-index-step0',
        intro: t(
          'Commander! To start a journey to the planet, you need to have your own planet. The following box can open planets of different quality, and the quality of the planet determines the comprehensive strength.',
        ),
      },
      {
        element: '.mystery-index-step1',
        intro: t("Let's open the first planet"),
        interactive: true,
      },
    ];
  }, [t]);

  React.useEffect(() => {
    return () => {
      dispatch(storeAction.toggleVisible({ visible: false }));
    };
  }, [dispatch]);

  return (
    <Layout>
      {!guides.guideFinish && guides.finish && steps.length - 1 > guides.step && (
        <>
          <GlobalStyle
            interactive={steps[activeStep]?.interactive && stepsEnabled}
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

      <Flex>
        <VipBox width={192}>
          <Flex width='80%' mt='60px' pl='10px' flexDirection='column'>
            <Text small>{t('Max sales: ')}&nbsp;</Text>
            <Title>{new BigNumber(maxSales).toNumber()}</Title>
          </Flex>
          <Flex width='80%' mt='15px' pl='10px' flexDirection='column'>
            <Text small>{t('Sold: ')}&nbsp;</Text>
            <Title>{new BigNumber(sold).toNumber()}</Title>
          </Flex>
        </VipBox>
        <Flex
          margin='auto'
          width='80%'
          justifyContent='space-between'
          position='relative'
        >
          <Box
            className='mystery-index-step0'
            width='94%'
            height='94%'
            position='absolute'
            top='0%'
            left='2%'
            zIndex={-1}
          />
          <Link to={`/mystery-box/state?q=${mysteryBoxQualities.ORDINARY}`}>
            <MysteryBoxCom
              className='mystery-index-step'
              position='relative'
              quality={mysteryBoxQualities.ORDINARY}
            >
              <Box
                className='mystery-index-step1'
                width='94%'
                height='94%'
                position='absolute'
                top='0%'
                left='2%'
                zIndex={-1}
              />
            </MysteryBoxCom>
          </Link>
          <Link to={`/mystery-box/state?q=${mysteryBoxQualities.ADVANCED}`}>
            <MysteryBoxCom quality={mysteryBoxQualities.ADVANCED} />
          </Link>
          <Link to={`/mystery-box/state?q=${mysteryBoxQualities.SUPER}`}>
            <MysteryBoxCom quality={mysteryBoxQualities.SUPER} />
          </Link>
        </Flex>
      </Flex>
    </Layout>
  );
};

export default MysteryBox;
