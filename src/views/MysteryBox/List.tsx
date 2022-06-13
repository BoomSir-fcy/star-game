import React, { useEffect, useState, useMemo } from 'react';
import {
  MysteryBoxBaseStyled,
  MysteryBoxBoxStyled,
  MysteryBoxQualities,
  MysteryBoxStyled,
} from 'components/MysteryBoxCom';
import useParsedQueryString from 'hooks/useParsedQueryString';
import { BgCard, Flex, Spinner, Text } from 'uikit';
import styled, { keyframes } from 'styled-components';
import StarCom from 'components/StarCom';
import { Globe } from 'components';
import { useDispatch } from 'react-redux';
import { fetchPlanetInfoAsync } from 'state/planet/fetchers';
import { useStore } from 'state';
import { QualityColor } from 'uikit/theme/colors';
import { useTranslation } from 'contexts/Localization';
import { useNavigate } from 'react-router-dom';

const frame0 = `
  left: 50%;
  top: 44%;
  transform: translate(-50%, -44%) scale(0.2);
  opacity: 1;
`;
const starframes0 = keyframes`
  0% {
    ${frame0}
  }
  50% {
    left: 30%;
    top: 30%;
    transform: translate(-30%, -30%) scale(0.5);
    opacity: 1;
  }
  100% {
    left: 7%;
    top: 20%;
    transform: translate(-7%, -12%) scale(1);
    opacity: 1;
  }
`;
const starframes1 = keyframes`
  0% {
    ${frame0}
  }
  100% {
    left: 29%;
    top: 20%;
    transform: translate(-29%, -17%) scale(1);
    opacity: 1;
  }
`;
const starframes2 = keyframes`
  0% {
    ${frame0}
  }
  100% {
    left: 49%;
    top: 20%;
    transform: translate(-49%, -17%) scale(1);
    opacity: 1;
  }
`;
const starframes3 = keyframes`
  0% {
    ${frame0}
  }
  100% {
    left: 69%;
    top: 20%;
    transform: translate(-69%, -17%) scale(1);
    opacity: 1;
  }
`;
const starframes4 = keyframes`
  0% {
    ${frame0}
  }
  50% {
    left: 65%;
    top: 30%;
    transform: translate(-65%, -30%) scale(0.5);
    opacity: 1;
  }
  100% {
    left: 89%;
    top: 20%;
    transform: translate(-89%, -17%) scale(1);
    opacity: 1;
  }
`;
const StarStyled = styled.img<{ step: number }>`
  display: ${({ step }) => (step === 1 ? 'inline-block' : 'none')};
  position: absolute;
  /* opacity: 0; */
  width: 165px;
  height: 165px;
  z-index: 2;

  &.star-0 {
    animation: ${starframes0} 1s linear;
  }
  &.star-1 {
    animation: ${starframes1} 1s linear 0.1s;
  }
  &.star-2 {
    animation: ${starframes2} 1s linear 0.2s;
  }
  &.star-3 {
    animation: ${starframes3} 1s linear 0.3s;
  }
  &.star-4 {
    animation: ${starframes4} 1s linear 0.4s;
  }
`;
const BaseStyled = styled(Flex)`
  justify-content: center;
  width: 400px;
  height: 400px;
  background: url(/images/mystery-box/base-ordinary.png);
  background-position: center;
`;
const boxframes = keyframes`
  0% {
    transform:  scale(1);
    opacity: 0.5;    
  }
  50% {
    transform:  scale(0.5);
    opacity: 0.5;    
  }
  100% {
    transform:  scale(0.2);
    opacity: 0;
  }
`;

const VideoBox = styled(Flex)<{ show: boolean }>`
  height: 100%;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  opacity: ${({ show }) => (show ? 1 : 0)};
  z-index: 1;
  transition: all 0.2s;
  animation: ${boxframes} 2s linear 1s;
`;

const GlobeBox = styled(Globe)<{ step: number }>`
  opacity: ${({ step }) => (step > 1 ? 1 : 0)};
  transition: all 0.2s;
  cursor: pointer;
`;

const List = () => {
  const paramsQs = useParsedQueryString();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const quality = Number(paramsQs.q) as MysteryBoxQualities;

  const planetInfo = useStore(p => p.planet.planetInfo);

  // const [videoVisible, setVideoVisible] = useState(true);
  const [step, setStep] = useState(1);

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

  useEffect(() => {
    if (planetList.length) {
      setTimeout(() => {
        setStep(p => p + 1);
      }, 1200);
    }
  }, [planetList]);

  return (
    <BgCard margin='auto' variant='longMedium' fringe>
      <Flex padding='30px' justifyContent='center'>
        <Text>{t('CONGRATULATIONS')}</Text>
      </Flex>

      <Flex alignItems='center'>
        {!planetList.length && (
          <Flex width='100%' alignItems='center' justifyContent='center'>
            <Spinner />
          </Flex>
        )}
        {planetList.length > 0 &&
          planetList.map((item, index) => (
            <BaseStyled key={item.id}>
              <StarStyled
                step={step}
                className={`star-${index}`}
                src={item.picture}
              />
              <GlobeBox
                step={step}
                scale='ld'
                shadow={QualityColor[item.rarity]}
                url={item.picture1}
                onClick={() => {
                  navigate(`/mystery-box/detail?i=${item.id}`);
                }}
              />
            </BaseStyled>
          ))}
      </Flex>

      {/* <VideoBox show={videoVisible}>
        <video
          autoPlay
          muted
          playsInline
          src={`/video/mbox-${quality}.mp4`}
          style={{ mixBlendMode: 'screen' }}
        />
      </VideoBox> */}
    </BgCard>
  );
};

export default List;
