import React, { useMemo, useState } from 'react';

import { Steps, Hints } from 'intro.js-react'; // 引入我们需要的组件
import 'intro.js/introjs.css';

import { Box, Text, BgCard, Flex, TweenText } from 'uikit';
import { Link } from 'react-router-dom';
import Layout from 'components/Layout';
import Dashboard from 'components/Dashboard';
import { MysteryBoxCom, mysteryBoxQualities } from 'components/MysteryBoxCom';
import { useFetchBoxView } from 'state/mysteryBox/hooks';
import { useGuide } from 'hooks/useGuide';
import { createGlobalStyle } from 'styled-components';
import { useDispatch } from 'react-redux';
import { storeAction } from 'state';
import { useTranslation } from 'contexts/Localization';

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

const MysteryBox = () => {
  useFetchBoxView();

  const { guides, setGuide } = useGuide('mystery-index');
  const dispatch = useDispatch();

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

  return (
    <Layout>
      <GlobalStyle
        interactive={steps[activeStep]?.interactive && stepsEnabled}
      />
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
            setActiveStep(event);
          }}
          onExit={index => {
            setStepsEnabled(false);
            console.log('退出', index);
            if (index < steps.length) {
              dispatch(storeAction.toggleVisible({ visible: true }));
            }
          }}
          onComplete={() => {
            console.log('完成');
          }}
          onBeforeExit={() => {
            console.log('退出之前');
            setStepsEnabled(true);
          }}
        />
      )}
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
    </Layout>
  );
};

export default MysteryBox;
