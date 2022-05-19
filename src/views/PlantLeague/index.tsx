import React from 'react';
import { createGlobalStyle, css } from 'styled-components';
import { Box, Flex, Text } from 'uikit';
import Layout from 'components/Layout';
import { useFetchAllianceView } from 'state/alliance/hooks';
import { useDispatch } from 'react-redux';
import { storeAction, useStore } from 'state';
import { fetchAllianceViewAsync } from 'state/alliance/reducer';
import eventBus from 'utils/eventBus';
import { Steps, Hints } from 'intro.js-react'; // 引入我们需要的组件
import { useGuide } from 'hooks/useGuide';
import { useLocation } from 'react-router-dom';
import JoinTheAlliance from './Join';
import LeagueInfo from './LeagueInfo';
import 'intro.js/introjs.css';

const GlobalStyle = createGlobalStyle<{
  interactive?: boolean;
  disabled?: boolean;
}>`
  ${({ disabled }) => {
    return disabled
      ? `
    .introjs-nextbutton {
      pointer-events: none !important;
      color: #9e9e9e !important;
      cursor: default !important;
    }
    `
      : '';
  }};


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

const PlantLeague = () => {
  useFetchAllianceView();
  const dispatch = useDispatch();
  const location = useLocation();
  const guideRef = React.useRef(null);

  const { guides, setGuide } = useGuide(location.pathname);

  const [stepsEnabled, setStepsEnabled] = React.useState(true);
  const [activeStep, setActiveStep] = React.useState(guides.step);
  const [steps, setSteps] = React.useState([
    {
      element: '.planet',
      intro: '星际探索需要3~5个星球组成才可进行，星际探索可以发掘更多资源。',
    },
    {
      element: '.planet_info',
      intro: '这里展示为星球联盟的资源和战力，以及包含的可用资产等。',
    },
    {
      element: '.join-union',
      intro: '点击选择一个星球，加入联盟',
      interactive: true,
      disabled: true,
    },
    {
      element: '.planet-union',
      intro:
        '至少还需要2个星球才可以进行探索，请添加其他星球，添加越多掠夺资源成功率越大',
      interactive: true,
      disabled: true,
    },
    {
      element: '.start_exploring',
      intro: '指挥官您已准备就绪，现在开始星际探索。',
      interactive: true,
    },
    {
      element: '.battle_report',
      intro: '指挥官! 联盟最新的战斗情况已生成，点击查看。',
      interactive: true,
    },
  ]);

  const onRefreshClick = React.useCallback(() => {
    dispatch(fetchAllianceViewAsync());
  }, [dispatch]);

  // 添加事件监听，用于更新状态
  React.useEffect(() => {
    eventBus.addEventListener('onRefresh', onRefreshClick);
    return () => {
      eventBus.removeEventListener('onRefresh', onRefreshClick);
    };
  }, [onRefreshClick]);

  const destroy = React.useCallback(() => {
    if (!guides.guideFinish) {
      setGuide(activeStep + 1);
    }
  }, [activeStep, guides.guideFinish, setGuide]);

  // React.useEffect(() => {
  //   setGuide(0);
  // }, [destroy, guides, setGuide]);

  return (
    <Layout>
      <GlobalStyle
        interactive={steps[activeStep]?.interactive && stepsEnabled}
        disabled={steps[activeStep]?.disabled}
      />
      {guides.finish && steps.length - 1 > guides.step && (
        <Steps
          enabled={stepsEnabled}
          steps={steps}
          initialStep={guides.step}
          options={{
            exitOnOverlayClick: false,
          }}
          ref={guideRef}
          onBeforeChange={event => {
            setActiveStep(event);
          }}
          onAfterChange={event => {}}
          onChange={currentStep => {
            if (currentStep > guides.step) {
              setGuide(currentStep);
            }
          }}
          onExit={step => {
            console.log('qiehuanye', step);
            setStepsEnabled(false);
            // dispatch(storeAction.toggleVisible({ visible: true }));
          }}
        />
      )}
      <Flex justifyContent='space-between' padding='0 30px'>
        <JoinTheAlliance callbackGuide={() => destroy()} />
        <LeagueInfo />
      </Flex>
    </Layout>
  );
};

export default PlantLeague;
