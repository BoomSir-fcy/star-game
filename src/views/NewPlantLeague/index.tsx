import React, { useEffect, useMemo, useState } from 'react';
import { Text, Flex, Box } from 'uikit';
import Layout from 'components/Layout';
import { useFetchAllianceView } from 'state/alliance/hooks';
import { orderInfo } from 'state/types';
import { useGuide } from 'hooks/useGuide';
import { useTranslation } from 'contexts/Localization';
import { Steps, Hints } from 'intro.js-react'; // 引入我们需要的组件
import { createGlobalStyle } from 'styled-components';
import { useDispatch } from 'react-redux';
import { storeAction, useStore } from 'state';
import { useLocation, useNavigate } from 'react-router-dom';

import AlliancePlanet from './components/AlliancePlanet';
import Explore from './components/Explore';
import RightFloatBox from './components/RightFloat';
import ExploreModule from './components/Module/ExploreModule';
import ManageModule from './components/Module/ManageModule';
import 'intro.js/introjs.css';
import { PlanetLeague, ToFind } from './components/AlliancePlanetStyle';

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

const NewPlantLeague: React.FC = () => {
  useFetchAllianceView();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { unread_plunder_count } = useStore(p => p.alliance.allianceView);
  const { guides, setGuide } = useGuide(location.pathname);

  const [ShowModule, setShowModule] = useState(false);
  const [Difficulty, setDifficulty] = useState(0);
  const [PlantManageModule, setPlantManageModule] = useState(false);
  const [ChoosePlant, setChoosePlant] = useState<orderInfo>();
  const [stepsEnabled, setStepsEnabled] = useState(true);
  const [activeStep, setActiveStep] = useState(guides.step);
  const guideRef = React.useRef(null);

  const ToAddClick = (className: string) => {
    setTimeout(() => {
      document
        .getElementsByClassName(className)[0]
        .dispatchEvent(new Event('click'));
    }, 500);
  };

  const ShowRound2 = useMemo(() => {
    if (guides.step === 8) {
      if (unread_plunder_count > 0) {
        return true;
      }
      return false;
    }
    return true;
  }, [guides.step, unread_plunder_count]);

  // 新手引导步骤
  const steps = useMemo(() => {
    const FirstArr = [
      {
        element: '.planet',
        intro: t(
          '指挥官！欢迎闪跃到星际空间，这里是你的联盟阵地（行星联盟），它们将为你生产资源和敌对战斗。联盟由5颗行星组成，让我们先获得行星。',
        ),
      },
      {
        element: '.tofind',
        intro: t('在发现里，你可以获得各种品质的行星，点击让我们开始把！'),
        interactive: true,
        disabled: true,
      },
      {
        element: '.planet',
        intro: t(
          '非常棒！行星联盟已经部署完毕。开始探索前我们必须对联盟上的行星进行有效管理，才能在探索中取得胜利及更多资源。',
        ),
      },
      {
        element: '.ball_1',
        intro: t('点击当前行星，开始养成行星吧。'),
        interactive: true,
        disabled: !PlantManageModule,
      },
      {
        element: '.Manage_planet',
        intro: t('点击按钮，开始养成行星。'),
        interactive: true,
        disabled: true,
      },
      {
        element: '.Start_Exploration',
        intro: t(
          '非常好！我们完成了探索前的一些准备，探索需要5个行星组成才可进行。点击探索',
        ),
        interactive: true,
        disabled: !ShowModule,
      },
      {
        element: '.Exploration_Difficulty',
        intro: t(
          '探索不同的难度，会有不同的遭遇和收货，选择想要挑战的难度吧！',
        ),
        interactive: true,
      },
      {
        element: '.leagueOutBox',
        intro: t(
          '即将开始探索，你可以选择立马探索，或者对其他星球进行战斗部署。完善的战斗部署才会让你在探索中获得优势。接下来将由指挥官你自己选择了',
        ),
        disabled: true,
      },
      {
        element: '.Alliance_Messages',
        intro: t('指挥官! 联盟最新的战斗情况已生成，点击查看。'),
        interactive: true,
      },
    ];
    return FirstArr;
  }, [t, PlantManageModule, ShowModule]);

  const Booting = useMemo(() => {
    return (
      stepsEnabled &&
      !guides.guideFinish &&
      guides.finish &&
      steps.length - 1 >= guides.step &&
      ShowRound2
    );
  }, [stepsEnabled, guides, steps, ShowRound2]);

  useEffect(() => {
    console.log(guides.step, '步骤');

    if (guides.step === 4 || guides.step === 6) {
      console.log(guides.step, '返回上一步');
      ToAddClick('introjs-prevbutton');
    }
    if (guides.step === 5) {
      document
        .getElementsByClassName('introjs-prevbutton')[0]
        .setAttribute('style', 'display:none !important');
    }
    if (guides.step === 7) {
      setShowModule(true);
    }
  }, [guides.step, setGuide]);

  useEffect(() => {
    if (Booting) {
      document
        .getElementsByClassName('introjs-bullets')[0]
        .setAttribute('style', 'opacity:0');
    }
  }, [Booting]);

  return (
    <Layout height='940px' className='leagueOutBox'>
      {Booting && (
        <>
          <PlanetLeague className='planet' />
          <GlobalStyle
            interactive={steps[activeStep]?.interactive && stepsEnabled}
            disabled={steps[activeStep]?.disabled}
          />
          <Steps
            enabled={stepsEnabled}
            steps={steps}
            initialStep={guides.step}
            options={{
              exitOnOverlayClick: false,
            }}
            ref={guideRef}
            onBeforeChange={event => {
              if (event === 5) {
                document
                  .getElementsByClassName('introjs-prevbutton')[0]
                  .setAttribute('style', 'display:none !important');
              } else {
                document
                  .getElementsByClassName('introjs-prevbutton')[0]
                  .setAttribute('style', '');
              }
              console.log(event, 'onBeforeChange');
              setActiveStep(event);
            }}
            onAfterChange={event => {}}
            onChange={currentStep => {
              if (currentStep > guides.step) {
                setGuide(currentStep);
              }
            }}
            onExit={step => {
              console.log(step, '中途离开页面', guides.step, activeStep);
              setStepsEnabled(false);
              if (step === 1) {
                setGuide(2, false);
                return;
              }
              if (step === 4) {
                setGuide(5, false);
                return;
              }
              if (step === 7) {
                setGuide(8, false, 2);
                return;
              }
              if (step === 8) {
                setGuide(8, true, 2);
                return;
              }
              if (step < steps.length - 1) {
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
      <AlliancePlanet
        guidesStep={guides.step}
        setGuide={step => {
          setGuide(step);
          ToAddClick('introjs-nextbutton');
        }}
        stopAround={Booting}
        setChoosePlant={e => {
          setChoosePlant(e);
        }}
        setPlantManageModule={e => {
          setShowModule(false);
          setPlantManageModule(e);
        }}
      />
      <Explore
        Difficulty={Difficulty}
        ShowModule={ShowModule}
        setShowModule={e => {
          setPlantManageModule(false);
          setShowModule(e);
          if (Booting) {
            ToAddClick('introjs-nextbutton');
          }
        }}
      />
      <RightFloatBox />
      <Box zIndex={1} position='relative'>
        <ExploreModule
          ShowModule={ShowModule}
          Difficulty={Difficulty}
          setDifficulty={e => setDifficulty(e)}
        />
        <ManageModule
          PlantManageModule={PlantManageModule}
          ChoosePlant={ChoosePlant}
        />
      </Box>
    </Layout>
  );
};

export default NewPlantLeague;
