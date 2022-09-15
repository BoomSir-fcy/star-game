import React from 'react';
import styled, { createGlobalStyle, css } from 'styled-components';
import { Box, Flex, Text, Button, Image } from 'uikit';
import Layout from 'components/Layout';
import { useFetchAllianceView } from 'state/alliance/hooks';
import { useDispatch } from 'react-redux';
import { storeAction, useStore } from 'state';
import { fetchAllianceViewAsync } from 'state/alliance/reducer';
import eventBus from 'utils/eventBus';
import { Steps, Hints } from 'intro.js-react'; // 引入我们需要的组件
import { BuyVipModal } from 'components/Modal/buyVipModal';
import { useTranslation } from 'contexts/Localization';
import { fetchPlanetInfoAsync } from 'state/planet/fetchers';
import { useToast } from 'contexts/ToastsContext';
import { useGuide } from 'hooks/useGuide';
import { useLocation } from 'react-router-dom';
import JoinTheAlliance from './Join';
import LeagueInfo from './LeagueInfo';
import 'intro.js/introjs.css';
import { RechargeAssets } from './RechargeAssets';
import { ThingRepairModal } from '../Star/components/Modal';

import { useBuildingRepair } from '../Star/components/gameModel/hooks';

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

const VipBox = styled(Box)`
  background: url(/images/commons/nav/left.png) no-repeat;
  /* background-size: 100% 100%; */
  width: 193px;
  background-position: right top;
`;

const PlantLeague = () => {
  useFetchAllianceView();
  const dispatch = useDispatch();
  const location = useLocation();
  const guideRef = React.useRef(null);

  const { t } = useTranslation();
  const { setBatchRepair } = useBuildingRepair();
  const { toastSuccess } = useToast();
  const { guides, setGuide } = useGuide(location.pathname);
  const [stepsEnabled, setStepsEnabled] = React.useState(true);
  const [activeStep, setActiveStep] = React.useState(guides.step);

  const workingList = useStore(p => p.alliance.workingPlanet);

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

  const { userInfo } = useStore(p => p.userInfo);
  const [visible, setVisible] = React.useState(false);
  const [rechargeVisible, setRechargeVisible] = React.useState(false);
  const [repairVisible, setRepairVisible] = React.useState(false);
  const [modalTips, setModalTips] = React.useState('');

  // 一键补充行星联盟充值
  const rechargeHandle = React.useCallback(() => {
    if (userInfo.vipBenefits?.is_vip) {
      setRechargeVisible(true);
      return;
    }
    setModalTips(
      t(
        'One-click replenishment of storage tank energy, and resources can be deployed faster',
      ),
    );
    setVisible(true);
  }, [
    t,
    setVisible,
    setRechargeVisible,
    userInfo.vipBenefits?.is_vip,
    setModalTips,
  ]);

  // 行星联盟一键修复耐久
  const repairHandle = React.useCallback(() => {
    if (userInfo.vipBenefits?.is_vip) {
      setRepairVisible(true);
      return;
    }
    setModalTips(
      t(
        'One-click repair durability, you can repair the durability of all buildings on the planet faster',
      ),
    );
    setVisible(true);
  }, [
    t,
    setVisible,
    setRepairVisible,
    userInfo.vipBenefits?.is_vip,
    setModalTips,
  ]);

  return (
    <Layout>
      {!guides.guideFinish &&
        guides.finish &&
        steps.length - 1 > guides.step &&
        guides.round < 2 && (
          <>
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
                // console.log(step, '中途离开页面', guides.step, activeStep);
                setStepsEnabled(false);
                if (step === 5) {
                  setGuide(0, false, 2);
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
      <Flex justifyContent='space-between' pr='30px'>
        <VipBox width={192}>
          <Flex
            margin='48px 0 15px'
            justifyContent='center'
            alignItems='center'
            pr='32px'
          >
            <Image
              src='/images/commons/icon/icon-vip.png'
              width={42}
              height={40}
              mr='8px'
            />
            <Title>VIP</Title>
          </Flex>
          <Button
            onClick={rechargeHandle}
            ml='10px'
            width={147}
            variant='purple'
          >
            {t('Supplement Resources')}
          </Button>
          <Button
            onClick={repairHandle}
            ml='10px'
            mt='16px'
            width={147}
            variant='purple'
          >
            {t('planetModalTitleRepairDurability')}
          </Button>
        </VipBox>
        <JoinTheAlliance callbackGuide={() => destroy()} />
        <LeagueInfo />
      </Flex>
      <BuyVipModal
        tips={modalTips}
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
      />
      <RechargeAssets
        visible={rechargeVisible}
        onClose={() => setRechargeVisible(false)}
      />

      {repairVisible && (
        <ThingRepairModal
          planet_id={workingList}
          visible={repairVisible}
          onChange={async () => {
            const res = await setBatchRepair(workingList);
            if (res) {
              dispatch(fetchPlanetInfoAsync(workingList));
              setRepairVisible(false);
              toastSuccess(t('planetQuickFixSuccessful'));
            }
          }}
          onClose={() => setRepairVisible(false)}
        />
      )}
    </Layout>
  );
};

export default PlantLeague;
