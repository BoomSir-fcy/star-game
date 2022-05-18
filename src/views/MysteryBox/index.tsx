import React, { useState } from 'react';

import { Steps, Hints } from 'intro.js-react'; // 引入我们需要的组件
import 'intro.js/introjs.css';

import { Box, Text, BgCard, Flex, TweenText } from 'uikit';
import { Link } from 'react-router-dom';
import Layout from 'components/Layout';
import Dashboard from 'components/Dashboard';
import { MysteryBoxCom, mysteryBoxQualities } from 'components/MysteryBoxCom';
import { useFetchBoxView } from 'state/mysteryBox/hooks';
import { useGuide } from 'hooks/useGuide';

const MysteryBox = () => {
  useFetchBoxView();

  const { guides, setGuide } = useGuide('mystery-index');

  // 控制是否开启新手指导的
  const [stepsEnabled, setStepsEnabled] = useState(true);
  const [steps, setSteps] = useState([
    {
      element: '.mystery-index-step0',
      intro:
        '指挥官!开启星球之旅，需要拥有自己的星球。下面盒子可以开出不同品质星球，星球品质决定着综合实力。!',
    },
    {
      element: '.mystery-index-step1',
      intro: '让我们开启第一个星球吧',
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
