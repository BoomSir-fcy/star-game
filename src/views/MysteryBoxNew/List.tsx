import React, { useMemo, useEffect, useCallback, useState } from 'react';
import {
  MysteryBoxCom,
  MysteryBoxQualities,
} from 'components/MysteryBoxComNew';
import useParsedQueryString from 'hooks/useParsedQueryString';
import { Box, Flex, Text, Image, Button, Spinner, Dots } from 'uikit';
import { Globe, RaceAvatar } from 'components';
import styled, { keyframes } from 'styled-components';
import { useDispatch } from 'react-redux';
import { useStore } from 'state';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'contexts/Localization';
import { fetchPlanetInfoAsync } from 'state/planet/fetchers';
import { QualityColor, RaceTypeColor } from 'uikit/theme/colors';
import { raceData } from 'config/raceConfig';
import { useJoinAlliance } from 'views/Star/hook';
import { useToast } from 'contexts/ToastsContext';
import { useFetchAllianceView } from 'state/alliance/hooks';

const StarFrame = keyframes`
  0% {
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
    opacity: 0;
  }
  100% {
    opacity: 1;
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
const AnimationStar = styled(Box)`
  &.star0 {
    animation: ${StarFrame} 1.5s cubic-bezier(0.19, -0.54, 0.73, 1.35) 0.1s both;
  }
  &.star1 {
    animation: ${StarFrame} 1.5s cubic-bezier(0.19, -0.54, 0.73, 1.35) 1.4s both;
  }
  &.star2 {
    animation: ${StarFrame} 1.5s cubic-bezier(0.19, -0.54, 0.73, 1.35) 2.6s both;
  }
  &.star3 {
    animation: ${StarFrame} 1.5s cubic-bezier(0.19, -0.54, 0.73, 1.35) 3.9s both;
  }
  &.star4 {
    animation: ${StarFrame} 1.5s cubic-bezier(0.19, -0.54, 0.73, 1.35) 5s both;
  }
`;
const ContentBox = styled(Box)`
  & .star-desc {
    opacity: 0;
    animation: ${StarDescFrame} 2s linear 6s both;
  }
`;
const Light = styled(Box)`
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
    animation: ${LightFrame} 1s ease-in-out 1.3s both;
  }
  &.light-2 {
    animation: ${LightFrame} 1s ease-in-out 2.5s both;
  }
  &.light-3 {
    animation: ${LightFrame} 1s ease-in-out 3.7s both;
  }
  &.light-4 {
    animation: ${LightFrame} 1s ease-in-out 4.9s both;
  }
`;
const List = () => {
  useFetchAllianceView();
  const paramsQs = useParsedQueryString();
  const quality = Number(paramsQs.q) as MysteryBoxQualities;

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { SetWorking } = useJoinAlliance();
  const { toastSuccess, toastError } = useToast();

  const [pending, setPending] = useState(false);

  const planetInfo = useStore(p => p.planet.planetInfo);
  const { order } = useStore(p => p.alliance.allianceView);

  const planetIds = useMemo(() => {
    return String(paramsQs.i)
      ?.split(',')
      ?.map(v => Number(v));
  }, [paramsQs.i]);

  const planetList = useMemo(() => {
    return Object.values(planetInfo).filter(
      item => planetIds.indexOf(item.id) !== -1,
    );
  }, [planetInfo, planetIds]);

  useEffect(() => {
    if (planetIds) {
      dispatch(fetchPlanetInfoAsync(planetIds));
    }
  }, [planetIds, dispatch]);

  useEffect(() => {
    if (!planetList.length) {
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
  return (
    <ContentBox>
      <MysteryBoxCom
        rotate={0}
        left={0}
        right={0}
        bottom={0}
        quality={quality}
        style={{ opacity: 0.3 }}
      />
      <Flex justifyContent='space-evenly'>
        {!planetList.length && (
          <Flex width='100%' alignItems='center' justifyContent='center'>
            <Spinner />
          </Flex>
        )}
        {planetList.length > 0 &&
          planetList.map((item, index) => (
            <Box key={item?.id}>
              <Light className={`light-${index}`} />
              <Text
                className='star-desc'
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
                <Globe scale='ld' rotate url={item?.picture1} />
              </AnimationStar>
              <Flex className='star-desc' mt='30px' alignItems='center'>
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

      {planetList.length > 0 && (
        <Flex className='star-desc' mt='139px' justifyContent='center'>
          {order?.length === 0 && (
            <Button
              mr='60px'
              disabled={pending}
              variant='purple'
              width='355px'
              height='68px'
              onClick={async () => {
                setPending(true);
                try {
                  await SetWorking(planetList.map(v => v.id));
                  toastSuccess(t('Join Succeeded'));
                  navigate('/plant-league');
                } catch (e) {
                  console.error(e);
                  toastError(t('Join Failed'));
                  setPending(false);
                }
              }}
            >
              {pending ? (
                <Dots>{t('joining')}</Dots>
              ) : (
                <Text fontSize='18px' bold>
                  {t('OpenMysteryBoxBtnDesc1')}
                </Text>
              )}
            </Button>
          )}
          <Button
            variant='purple'
            width='355px'
            height='68px'
            onClick={() => {
              navigate('/plant-league');
            }}
          >
            <Text fontSize='18px' bold>
              {t('OpenMysteryBoxBtnDesc2')}
            </Text>
          </Button>
        </Flex>
      )}
    </ContentBox>
  );
};

export default List;
