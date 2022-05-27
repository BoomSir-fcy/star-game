import React from 'react';
import { createGlobalStyle, css } from 'styled-components';
import { Box, Flex, Text } from 'uikit';
import Layout from 'components/Layout';
import { useFetchAllianceView } from 'state/alliance/hooks';
import { useDispatch } from 'react-redux';
import { storeAction } from 'state';
import { fetchAllianceViewAsync } from 'state/alliance/reducer';
import eventBus from 'utils/eventBus';
import { Steps, Hints } from 'intro.js-react'; // 引入我们需要的组件
import { useTranslation } from 'contexts/Localization';
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

  const { t } = useTranslation();

  const { guides, setGuide } = useGuide(location.pathname);

  const [stepsEnabled, setStepsEnabled] = React.useState(true);
  const [activeStep, setActiveStep] = React.useState(guides.step);
  const steps = React.useMemo(
    () => [
      {
        element: '.planet',
        intro: t(
          'Interstellar exploration needs to be composed of 3 ~ 5 planets, and interstellar exploration can explore more resources.',
        ),
      },
      {
        element: '.planet_info',
        intro: t(
          'Here are the resources and combat power of the Star Alliance, as well as the available assets contained.',
        ),
      },
      {
        element: '.join-union',
        intro: t('Click to select a planet and join the alliance.'),
        interactive: true,
        disabled: true,
      },
      {
        element: '.planet-union',
        intro: t(
          'You need at least 2 more planets to explore. Please add other planets. The more you add, the greater the success rate of plundering resources.',
        ),
        interactive: true,
        disabled: true,
      },
      {
        element: '.start_exploring',
        intro: t('Commander, you are ready for interstellar exploration.'),
        interactive: true,
      },
      {
        element: '.battle_report',
        intro: t(
          'Commander! The latest battle situation of the alliance has been generated. Click to view it.',
        ),
        interactive: true,
      },
    ],
    [t],
  );

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
    setTimeout(() => {
      dispatch(storeAction.toggleVisible({ visible: false }));
    }, 100);
  }, [activeStep, dispatch, guides.guideFinish, setGuide]);

  React.useEffect(() => {
    return () => {
      dispatch(storeAction.toggleVisible({ visible: false }));
    };
  }, [dispatch]);

  // React.useEffect(() => {
  //   setGuide(4);
  // }, [destroy, guides, setGuide]);

  return (
    <Layout>
      <GlobalStyle
        interactive={steps[activeStep]?.interactive && stepsEnabled}
        disabled={steps[activeStep]?.disabled}
      />
      {!guides.guideFinish &&
        guides.finish &&
        steps.length - 1 > guides.step &&
        guides.round < 2 && (
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
              if (currentStep === 3) return;
              if (currentStep > guides.step) {
                setGuide(currentStep);
              }
            }}
            onExit={step => {
              console.log(step, '中途离开页面', guides.step, activeStep);
              setStepsEnabled(false);
              if (step === 5) {
                setGuide(0, false, 2);
                return;
              }
              dispatch(storeAction.toggleVisible({ visible: true }));
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
