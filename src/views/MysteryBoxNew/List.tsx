import React, { useMemo, useEffect, useCallback, useState } from 'react';
import {
  MysteryBoxCom,
  MysteryBoxQualities,
} from 'components/MysteryBoxComNew';
import useParsedQueryString from 'hooks/useParsedQueryString';
import { Box, Flex, Text, Image, Button, Spinner, Dots } from 'uikit';
import { ConnectWalletButton, Globe, RaceAvatar } from 'components';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import { useDispatch } from 'react-redux';
import { storeAction, useStore } from 'state';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'contexts/Localization';
import { fetchPlanetInfoAsync } from 'state/planet/fetchers';
import { QualityColor, RaceTypeColor } from 'uikit/theme/colors';
import { raceData } from 'config/raceConfig';
import { useJoinAlliance } from 'views/Star/hook';
import { useToast } from 'contexts/ToastsContext';
import { useFetchAllianceView } from 'state/alliance/hooks';
import { useWeb3React } from '@web3-react/core';
import { useGuide } from 'hooks/useGuide';
import { Steps } from 'intro.js-react';
import 'intro.js/introjs.css';

const GlobalStyle = createGlobalStyle<{
  interactive?: boolean;
}>`
  ${({ interactive }) => {
    return interactive
      ? `
    *{
      pointer-events: none;
    }
    .introjs-custom-btn, .introjs-showElement, .introjs-showElement *, .introjs-tooltip, .introjs-tooltip *{
      pointer-events: auto;
    }
    `
      : '';
  }};
`;

const moveKeyframes = keyframes`
  0% {
    transform: translate(0, -0);
    opacity: 1;    
    
  }
  50% {
    opacity:1;    
  }
  100% {
  transform: translate(100px, -100px);
  opacity: 1;    
  
    
  }
`;

const ArrowBox = styled(Box)`
  opacity: 1;
  animation: ${moveKeyframes} 2s linear infinite;
  & img {
    transform: rotate(90deg);
  }
`;

const ContentTweenFrame1 = keyframes`
  0% {
    opacity: 1;
    transform: translateY(0px) scale(0.9);
  }
  100% {
    opacity: 0.1;
    transform: translate(28rem,26rem) scale(0.05);
  }
`;
const ContentTweenFrame2 = keyframes`
  0% {
    opacity: 1;
    transform: translateY(0px) scale(0.9);
  }
  100% {
    opacity: 0.1;
    transform: translate(44rem,26rem) scale(0.05);
  }
`;
const StarFrame = keyframes`
  0% {
    /* 中间位置：transform: translate(48rem, 3rem); */
    transform: translateY(-1000px);
  }
  80% {
    transform: translateY(30px);
  }
  90% {
    transform: translateY(-30px);
  }
  100% {
    transform: translateY(0px);
  }
`;
const StarDescFrame = keyframes`
  0% {
    visibility: hidden;
    opacity: 0;
  }
  100% {
    visibility: unset;
    opacity: 1;
  }
`;
const StarDescFrame2 = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;
const LightFrame = keyframes`
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.3;
  }
`;
const SPEED = 1;
const AnimationStar = styled(Box)`
  &.star0 {
    animation: ${StarFrame} 1s cubic-bezier(0.19, -0.54, 0.73, 1.35) 0.1s both;
  }
  &.star1 {
    animation: ${StarFrame} 1s cubic-bezier(0.19, -0.54, 0.73, 1.35) 0.6s both;
  }
  &.star2 {
    animation: ${StarFrame} 1s cubic-bezier(0.19, -0.54, 0.73, 1.35) 1.1s both;
  }
  &.star3 {
    animation: ${StarFrame} 1s cubic-bezier(0.19, -0.54, 0.73, 1.35) 1.6s both;
  }
  &.star4 {
    animation: ${StarFrame} 1s cubic-bezier(0.19, -0.54, 0.73, 1.35) 2.1s both;
  }
`;
const ContentBox = styled(Box)<{ tween?: number }>`
  & .star-desc {
    animation: ${StarDescFrame} 2s linear 3s both;
  }
  & .star-desc-cancel {
    animation: ${StarDescFrame2} 1s linear -1s both;
  }
  &.tween-animation2 {
    animation: ${({ tween }) =>
        tween === 2 ? ContentTweenFrame2 : ContentTweenFrame1}
      1s linear 0s both;
  }
`;
const Light = styled(Box)<{ tween?: number }>`
  ${({ tween }) => (tween ? `display: none;` : '')}
  position: absolute;
  top: -330px;
  width: 220px;
  height: 580px;
  filter: blur(10px);
  ::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, #ffeab1, transparent);
    clip-path: polygon(35% 0, 65% 0, 100% 100%, 0% 100%);
  }
  &.light-0 {
    animation: ${LightFrame} 1s ease-in-out both;
  }
  &.light-1 {
    animation: ${LightFrame} 1s ease-in-out 0.5s both;
  }
  &.light-2 {
    animation: ${LightFrame} 1s ease-in-out 1s both;
  }
  &.light-3 {
    animation: ${LightFrame} 1s ease-in-out 1.5s both;
  }
  &.light-4 {
    animation: ${LightFrame} 1s ease-in-out 2s both;
  }
`;

const List = () => {
  useFetchAllianceView();
  const { account } = useWeb3React();
  const paramsQs = useParsedQueryString();
  const quality = Number(paramsQs.q) as MysteryBoxQualities;

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { SetWorking } = useJoinAlliance();
  const { toastSuccess, toastError } = useToast();

  const [tween, setTween] = useState(0);
  const [pending, setPending] = useState(false);
  const [planetList, setPlanetList] = useState(null);

  const planetInfo = useStore(p => p.planet.planetInfo);
  const { order } = useStore(p => p.alliance.allianceView);
  // 控制是否开启新手指导的
  const location = useLocation();
  const { guides, setGuide } = useGuide(location.pathname);
  const [stepsEnabled, setStepsEnabled] = useState(true);
  const [activeStep, setActiveStep] = useState(guides.step);
  const [arrowShow, setArrowShow] = useState(false);
  const [sleepShow, setSleepShow] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setSleepShow(true);
    }, 3500);
  }, []);

  const steps = useMemo(() => {
    if (!order || order?.length <= 0) {
      return [
        {
          element: '.mystery-list-step0',
          intro: t('GuideMysteryListStep0'),
        },
        {
          element: '.mystery-list-step1',
          intro: t('GuideMysteryListStep1'),
          interactive: true,
        },
      ];
    }
    return [
      {
        element: '.mystery-list-step0',
        intro: t('GuideMysteryListStep0'),
      },
    ];
  }, [t, order]);

  React.useEffect(() => {
    return () => {
      dispatch(storeAction.toggleVisible({ visible: false }));
    };
  }, [dispatch]);

  const planetIds = useMemo(() => {
    return String(paramsQs.i)
      ?.split(',')
      ?.map(v => Number(v));
  }, [paramsQs.i]);

  useEffect(() => {
    if (planetIds && planetInfo && !planetList) {
      const list = Object.values(planetInfo).filter(
        item => planetIds.indexOf(item.id) !== -1,
      );
      setPlanetList(list.length > 0 ? list : null);
    }
  }, [planetInfo, planetIds, planetList]);

  useEffect(() => {
    if (planetIds) {
      dispatch(fetchPlanetInfoAsync(planetIds));
    }
  }, [planetIds, dispatch]);

  useEffect(() => {
    if (!planetList) {
      setTimeout(() => {
        dispatch(fetchPlanetInfoAsync(planetIds));
      }, 10000);
    }
  }, [planetList, planetIds, dispatch]);

  const shortenToken = useCallback((str: string, chars = 4): string => {
    return `${str.substring(0, chars + 2)}...${str.substring(
      str.length - chars,
    )}`;
  }, []);

  const rendeButton = useMemo(() => {
    if (!account) {
      return (
        <ConnectWalletButton variant='purple' width='355px' height='68px' />
      );
    }

    if (planetList?.length > 0 && (!order || order?.length === 0)) {
      return (
        <>
          <Button
            mr='60px'
            disabled={pending}
            variant='purple'
            width='355px'
            height='68px'
            className='introjs-custom-btn'
            style={{ position: 'relative', zIndex: 99999999 }}
            onClick={async () => {
              setArrowShow(false);
              setPending(true);
              try {
                await SetWorking(planetList.map(v => v.id));
                toastSuccess(t('Join Succeeded'));
                setTween(2);
                setTimeout(() => {
                  navigate('/plant-league', { replace: true });
                }, 1200);
              } catch (e) {
                console.error(e);
                toastError(t('Join Failed'));
                setPending(false);
              }
            }}
          >
            {pending ? (
              <Dots>{t('Joining')}</Dots>
            ) : (
              <Text fontSize='18px' bold>
                {t('OpenMysteryBoxBtnDesc1')}
              </Text>
            )}
          </Button>
          <Button
            variant='purple'
            width='355px'
            height='68px'
            onClick={() => {
              setTween(1);
              setTimeout(() => {
                navigate('/star/planet', { replace: true });
              }, 1200);
            }}
          >
            <Text fontSize='18px' bold>
              {t('OpenMysteryBoxBtnDesc2')}
            </Text>
          </Button>
        </>
      );
    }

    return (
      <Button
        variant='purple'
        width='355px'
        height='68px'
        onClick={() => {
          setTween(1);
          setTimeout(() => {
            navigate('/star/planet', { replace: true });
          }, 1200);
        }}
      >
        <Text fontSize='18px' bold>
          {t('Confirm')}
        </Text>
      </Button>
    );
  }, [
    account,
    pending,
    planetList,
    order,
    SetWorking,
    navigate,
    toastError,
    toastSuccess,
    t,
  ]);

  const visibleGuide = useMemo(() => {
    if (planetList?.length > 0 && sleepShow) return true;
    return false;
  }, [planetList, sleepShow]);
  return (
    <ContentBox tween={tween} className={tween ? `tween-animation2` : ''}>
      {visibleGuide &&
        !guides.guideFinish &&
        guides.finish &&
        steps.length - 1 > guides.step && (
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
                if (currentStep === 1) {
                  setArrowShow(true);
                } else {
                  setArrowShow(false);
                }
                if (currentStep > guides.step) {
                  setGuide(currentStep);
                }
              }}
              onBeforeChange={event => {
                setActiveStep(event);
              }}
              onExit={index => {
                setStepsEnabled(false);
                setArrowShow(false);
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
      <MysteryBoxCom
        rotate={0}
        left={0}
        right={0}
        bottom={0}
        quality={quality}
        style={{ opacity: 0.3 }}
      />
      <Flex className='mystery-list-step0' justifyContent='space-evenly'>
        {!planetList?.length && (
          <Flex width='100%' alignItems='center' justifyContent='center'>
            <Spinner />
          </Flex>
        )}
        {planetList?.length > 0 &&
          planetList?.map((item, index) => (
            <Box key={item?.id}>
              <Light tween={tween} className={`light-${index}`} />
              <Text
                className={tween ? 'star-desc-cancel' : 'star-desc'}
                mb='6px'
                textAlign='center'
                fontSize='26px'
                bold
                color={QualityColor[item?.rarity]}
              >
                {item?.rarity ? t(`rarity-${item?.rarity}`) : ''}
              </Text>
              <AnimationStar
                className={`star${index}`}
                onClick={() => {
                  navigate(`/mystery-box/detail?i=${item?.id}`);
                }}
              >
                <Globe
                  shadow={QualityColor[item?.rarity]}
                  scale='ld'
                  rotate
                  url={item?.picture1}
                />
              </AnimationStar>
              <Flex
                className={tween ? 'star-desc-cancel' : 'star-desc'}
                mt='30px'
                alignItems='center'
              >
                <RaceAvatar width='44px' height='44px' race={item?.race} />
                <Box ml='9px'>
                  <Text color={RaceTypeColor[item?.race]} fontSize='18px' bold>
                    {item?.race ? t(raceData[item?.race]?.name) : ''}
                  </Text>
                  <Text small>
                    <span>Token: </span> {shortenToken(item?.id?.toString())}
                  </Text>
                </Box>
              </Flex>
            </Box>
          ))}
      </Flex>
      <Flex
        className={tween ? 'star-desc-cancel' : 'star-desc'}
        mt='139px'
        justifyContent='center'
        position='relative'
      >
        <Box
          className='mystery-list-step1'
          position='absolute'
          width='550px'
          height='268px'
          left={380}
          top={-50}
        />
        {arrowShow && (
          <ArrowBox
            position='absolute'
            top={100}
            left={400}
            width={100}
            height={100}
          >
            <Image
              width={100}
              height={100}
              src='/images/commons/icon/to-arrow-new.png'
            />
          </ArrowBox>
        )}
        {rendeButton}
      </Flex>
    </ContentBox>
  );
};

export default List;
