import React, {
  useMemo,
  useEffect,
  useCallback,
  useState,
  useRef,
} from 'react';
import {
  MysteryBoxCom,
  MysteryBoxQualities,
} from 'components/MysteryBoxComNew';
import useParsedQueryString from 'hooks/useParsedQueryString';
import { Box, Flex, Text, Image, Button, Spinner, Dots, MarkText } from 'uikit';
import { ConnectWalletButton, Globe, PlanetBall, RaceAvatar } from 'components';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import { useDispatch } from 'react-redux';
import { storeAction, useStore } from 'state';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'contexts/Localization';
import { fetchPlanetInfoAsync } from 'state/planet/fetchers';
import { QualityColor, RaceTypeColor } from 'uikit/theme/colors';
import { raceData } from 'config/raceConfig';

import { BuildRaceData } from 'config/buildConfig';
import { useJoinAlliance } from 'views/Star/hook';
import { useToast } from 'contexts/ToastsContext';
import { useFetchAllianceView } from 'state/alliance/hooks';
import { useWeb3React } from '@web3-react/core';
import { useGuide } from 'hooks/useGuide';
import { Steps } from 'intro.js-react';
import 'intro.js/introjs.css';
import { setActivePlanet } from 'state/planet/actions';
import {
  EditOpenBlindModalAsync,
  clearOpenBlindIds,
} from 'state/mysteryBox/reducer';
import { VideoStyled } from 'components/OpenBlindPlanet/BlindPlanetBox';
import { GlobalVideo } from 'components/Video';
import { getBuilderSpriteRes } from 'building/core/utils';

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
const LightFrame2 = keyframes`
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.9;
  }
`;
const SPEED = 1;
const AnimationStar = styled(Box)`
  position: relative;
  cursor: pointer;
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
  height: 850px;
  &.tween-animation2 {
    animation: ${({ tween }) =>
        tween === 2 ? ContentTweenFrame2 : ContentTweenFrame1}
      1s linear 0s both;
  }
`;
const Light = styled(Box)<{ tween?: number; haveGift: boolean }>`
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
    animation: ${({ haveGift }) => (haveGift ? LightFrame2 : LightFrame)} 1s
      ease-in-out both;
  }
  &.light-1 {
    animation: ${({ haveGift }) => (haveGift ? LightFrame2 : LightFrame)} 1s
      ease-in-out 0.5s both;
  }
  &.light-2 {
    animation: ${({ haveGift }) => (haveGift ? LightFrame2 : LightFrame)} 1s
      ease-in-out 1s both;
  }
  &.light-3 {
    animation: ${({ haveGift }) => (haveGift ? LightFrame2 : LightFrame)} 1s
      ease-in-out 1.5s both;
  }
  &.light-4 {
    animation: ${({ haveGift }) => (haveGift ? LightFrame2 : LightFrame)} 1s
      ease-in-out 2s both;
  }
`;

// const VideoBox = styled(Box)`
//   position: absolute;
//   background: url('/images/commons/123.png') no-repeat;
//   background-size: 0%;
//   top: -3%;
//   left: -39%;
// `;
const VideoBox = styled(GlobalVideo)<{ scale?: number }>`
  & .MyPlanetBall {
    transform: ${({ scale }) => `scale(${scale})`};
    position: absolute;
    left: ${({ scale }) => `${10 * scale}px`};
    top: ${({ scale }) => `${10 * scale}px`};
    z-index: -1;
  }
`;

const CheckText = styled(MarkText)`
  position: absolute;
  font-style: normal;
  font-size: 18px;
  font-weight: bold;
  top: 102px;
  left: 20px;
`;

const LightBox = styled(Box)<{ type: number }>`
  border: 1px solid ${({ type }) => (type === 1 ? '#FFD63E' : '#FF02C5')};
  box-shadow: 0px 0px 7px 3px
    ${({ type }) => (type === 1 ? '#FFD63E' : '#FF02C5')};
  padding: 6px;
  background: linear-gradient(270deg, #162d37, #0b1c22, #0a161b);
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
  const { openBlindIds } = useStore(p => p.mysteryBox);
  const { scale } = useStore(p => p.user);

  // 控制是否开启新手指导的
  const location = useLocation();
  const { guides, setGuide } = useGuide(location.pathname);
  const [stepsEnabled, setStepsEnabled] = useState(true);
  const [activeStep, setActiveStep] = useState(guides.step);
  const [arrowShow, setArrowShow] = useState(false);
  const [sleepShow, setSleepShow] = useState(false);

  const timer = useRef<ReturnType<typeof setTimeout>>();

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
      // 确保一次性渲染5个星球
      setPlanetList(list.length === 5 ? list : null);
    }
  }, [planetInfo, planetIds, planetList]);

  useEffect(() => {
    if (planetIds) {
      dispatch(fetchPlanetInfoAsync(planetIds));
    }
  }, [planetIds, dispatch]);

  useEffect(() => {
    if (timer.current) {
      clearInterval(timer.current);
    }
    if (!planetList) {
      timer.current = setInterval(() => {
        dispatch(fetchPlanetInfoAsync(planetIds));
      }, 5000);
    }
    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
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
                dispatch(clearOpenBlindIds());
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
              dispatch(clearOpenBlindIds());
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
          dispatch(clearOpenBlindIds());
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
    dispatch,
  ]);

  const visibleGuide = useMemo(() => {
    if (planetList?.length > 0 && sleepShow) return true;
    return false;
  }, [planetList, sleepShow]);

  const GetVideoPosition = useCallback((index: number, rarity: number) => {
    switch (index) {
      case 0:
        return rarity !== 3 ? 114 : 110;
      case 1:
        return rarity !== 3 ? 472 : 468;
      case 2:
        return rarity !== 3 ? 830 : 826;
      case 3:
        return rarity !== 3 ? 1190 : 1186;
      case 4:
        return rarity !== 3 ? 1548 : 1544;
      default:
        return null;
    }
  }, []);

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
      <Flex
        className='mystery-list-step0'
        pt='124px'
        justifyContent='space-evenly'
        height='calc(100% - 130px)'
      >
        {!planetList?.length && (
          <Flex width='100%' alignItems='center' justifyContent='center'>
            <Spinner />
          </Flex>
        )}
        {planetList?.length > 0 &&
          planetList?.map((item, index) => (
            <Box position='relative' key={item?.id} width='230px'>
              <Light
                tween={tween}
                haveGift={item.give_level > 1 || item.give_build_index !== 0}
                className={`light-${index}`}
              />
              {openBlindIds?.indexOf(item.id) !== -1 && (
                <Text
                  className={tween ? 'star-desc-cancel' : 'star-desc'}
                  mb='36px'
                  textAlign='center'
                  fontSize='26px'
                  bold
                  color={QualityColor[item?.rarity]}
                >
                  {item?.rarity ? t(`rarity-${item?.rarity}`) : ''}
                </Text>
              )}
              <AnimationStar
                // style={{
                //   opacity: openBlindIds?.indexOf(item.id) !== -1 ? 0 : 1,
                // }}
                mt={openBlindIds?.indexOf(item.id) !== -1 ? '' : '75px'}
                className={`star${index}`}
                onClick={() => {
                  if (openBlindIds?.indexOf(item.id) !== -1) {
                    navigate(`/mystery-box/detail?i=${item?.id}`);
                    return;
                  }
                  dispatch(setActivePlanet(item));
                  dispatch(EditOpenBlindModalAsync(true));
                }}
              >
                <PlanetBall
                  shadow={
                    openBlindIds?.indexOf(item.id) !== -1
                      ? QualityColor[item?.rarity]
                      : '#00000094'
                  }
                  scale='ld'
                  rotate
                  url={item?.picture1}
                />
                {openBlindIds?.indexOf(item.id) === -1 && (
                  <CheckText>{t('Click to reveal rarity')}</CheckText>
                )}
              </AnimationStar>
              <Flex
                className={tween ? 'star-desc-cancel' : 'star-desc'}
                pt='30px'
                alignItems='center'
                justifyContent='center'
              >
                <RaceAvatar width='44px' height='44px' race={item?.race} />
                <Box ml='9px'>
                  <Text color={RaceTypeColor[item?.race]} fontSize='18px' bold>
                    {item?.race ? t(raceData[item?.race]?.name) : ''}
                  </Text>
                  <Text small>
                    <span>Token: </span> {item?.id}
                  </Text>
                </Box>
              </Flex>
              {(item.give_level > 1 || item.give_build_index !== 0) && (
                <Flex
                  className={tween ? 'star-desc-cancel' : 'star-desc'}
                  pt='20px'
                  justifyContent='center'
                  flexDirection='column'
                >
                  <Text
                    fontSize='18px'
                    mark
                    fontStyle='normal'
                    bold
                    mb='16px'
                    width='230px'
                    textAlign='center'
                  >
                    {t('Extra Bonus')}
                  </Text>
                  {item.give_level > 1 && (
                    <LightBox mb={16} type={1}>
                      <Text color='#FFD63E'>
                        {t('Free Planet Upgrade')}:&nbsp;
                        {`Lv.1 > Lv.${item.give_level}`}
                      </Text>
                    </LightBox>
                  )}
                  {item.give_build_index !== 0 && (
                    <LightBox type={2}>
                      <Text color='#FF02C5'>{t('Free Building')}:&nbsp;</Text>
                      <Text color='#FF02C5'>
                        {t(
                          BuildRaceData[item?.race][item?.give_build_index]
                            ?.name,
                        )}
                        *1
                      </Text>
                    </LightBox>
                  )}
                </Flex>
              )}
              {openBlindIds?.indexOf(item.id) !== -1 &&
                item?.rarity !== 1 &&
                item?.rarity !== 2 && (
                  // <VideoBox width={410} height={410}>
                  //   <VideoStyled
                  //     width='100%'
                  //     height='100%'
                  //     src={`/video/${item?.rarity}rarity.mp4`}
                  //     autoPlay
                  //     muted
                  //     loop
                  //     playsInline
                  //   />
                  // </VideoBox>
                  <VideoBox
                    width={260}
                    height={260}
                    src={`/video/${item?.rarity}rarity.mp4`}
                    loop
                    left={GetVideoPosition(index, item?.rarity)}
                    top={item?.rarity !== 3 ? 236 : 234}
                    margin='auto'
                    scale={scale}
                  >
                    {/* <PlanetBall
                      className='MyPlanetBall'
                      shadow={
                        openBlindIds?.indexOf(item.id) !== -1
                          ? QualityColor[item?.rarity]
                          : 0
                      }
                      scale='ld'
                      rotate={openBlindIds?.indexOf(item.id) !== -1}
                      url={item?.picture1}
                    /> */}
                  </VideoBox>
                )}
            </Box>
          ))}
      </Flex>
      <Flex
        className={tween ? 'star-desc-cancel' : 'star-desc'}
        mt='60px'
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
