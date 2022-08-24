import React, { useMemo, HTMLAttributes, useState } from 'react';
import { Text, Flex, BoxProps, Box, Button } from 'uikit';
import { useTranslation } from 'contexts/Localization';
import styled, { keyframes } from 'styled-components';
import {
  position,
  layout,
  PositionProps,
  LayoutProps,
  margin,
  MarginProps,
} from 'styled-system';
import { APP_HEIGHT, APP_WIDTH } from 'config';
import { QualityColor, RaceTypeColor } from 'uikit/theme/colors';
import { PlanetBall, RaceAvatar } from 'components';
import { raceData } from 'config/raceConfig';
import { shortenAddress } from 'utils/contract';
import { useStore } from 'state';
import { useDispatch } from 'react-redux';
import { setActivePlanet } from 'state/planet/actions';
import {
  EditOpenBlindModalAsync,
  setOpenBlindIds,
} from 'state/mysteryBox/reducer';

interface VideoSystem
  extends PositionProps,
    LayoutProps,
    MarginProps,
    HTMLAttributes<HTMLVideoElement> {
  center?: boolean;
  rotate?: number;
}

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
const starVideoFrame = keyframes`
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
export const VideoStyled = styled.video<VideoSystem>`
  /* position: absolute; */
  ${layout}
  ${margin}
  object-fit: fill;
  mix-blend-mode: screen;
  z-index: 99;
`;

const OutBox = styled(Box)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  z-index: 999;
  & .shock {
    animation: shake 2s ease-in-out;
  }
  @keyframes shake {
    5%,
    95% {
      transform: translate3d(-20px, -20px, 0);
    }
    10%,
    90% {
      transform: translate3d(20px, 20px, 0);
    }
    15%,
    85% {
      transform: translate3d(-20px, -20px, 0);
    }
    20%,
    80% {
      transform: translate3d(20px, 20px, 0);
    }
    25%,
    75% {
      transform: translate3d(-20px, -20px, 0);
    }
    30%,
    70% {
      transform: translate3d(20px, 20px, 0);
    }
    35%,
    65% {
      transform: translate3d(-20px, -20px, 0);
    }
    40%,
    60% {
      transform: translate3d(20px, 20px, 0);
    }
    45%,
    55% {
      transform: translate3d(-20px, -20px, 0);
    }
    50% {
      transform: translate3d(20px, 20px, 0);
    }
  }
`;

const PlanetInfoBox = styled(Box)<{ scale: number }>`
  width: max-content;
  transform-origin: 0 0;
  position: absolute;
  top: 24%;
  left: 44%;
  transform: ${({ scale }) => `scale(${scale})`};
  & .star-desc {
    animation: ${StarDescFrame} 2s linear;
  }
  & .star-desc-cancel {
    animation: ${StarDescFrame2} 1s linear -1s both;
  }
  & .star-video {
    animation: ${starVideoFrame} 2s linear;
  }
  & .no-video {
    display: none;
  }
`;

const Light = styled(Box)<{ Open?: boolean }>`
  ${({ Open }) => (!Open ? `display: none;` : '')}
  position: absolute;
  top: -330px;
  width: 220px;
  height: 580px;
  filter: blur(10px);
  animation: ${LightFrame} 2s ease-in-out both;
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
`;

const VideoBox = styled(Box)`
  position: absolute;
  /* top: -3%;
  left: -39%; */
`;

const VideoBeginBox = styled(Box)`
  position: absolute;
`;

const BlindPlanetBox: React.FC<{
  scale: number;
}> = ({ scale }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { activePlanet: info } = useStore(p => p.planet);
  const [Open, setOpen] = useState(false);

  const [PlayingBegin, setPlayingBegin] = useState(false);

  return (
    <OutBox
      onClick={() => {
        dispatch(EditOpenBlindModalAsync(false));
        dispatch(setActivePlanet(null));
      }}
    >
      <PlanetInfoBox
        className={PlayingBegin && info?.rarity === 6 ? 'shock' : ''}
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
        }}
        scale={scale}
      >
        {info?.rarity !== 1 && <Light Open={Open} />}
        <Text
          className={Open ? 'star-desc' : 'star-desc-cancel'}
          mb='36px'
          textAlign='center'
          fontSize='26px'
          bold
          color={QualityColor[info?.rarity]}
        >
          {info?.rarity ? t(`rarity-${info?.rarity}`) : ''}
        </Text>
        <PlanetBall
          shadow={Open ? QualityColor[info?.rarity] : ''}
          scale='ld'
          rotate={Open}
          url={info?.picture1}
        />
        {!Open && !PlayingBegin && (
          <Flex mt='100px' justifyContent='center'>
            <Button
              variant='purple'
              width='150px'
              height='45px'
              onClick={() => {
                dispatch(setOpenBlindIds(info.id));
                if (info?.rarity === 5 || info?.rarity === 6) {
                  setPlayingBegin(true);
                  setTimeout(() => {
                    // 完成播放
                    setPlayingBegin(false);
                    setOpen(true);
                  }, 5000);
                } else {
                  setOpen(true);
                }
              }}
            >
              <Text fontSize='18px' color='textPrimary' bold>
                {t('Open')}
              </Text>
            </Button>
          </Flex>
        )}
        <VideoBox
          width={410}
          height={410}
          top={info?.rarity !== 3 ? '-3%' : '-5%'}
          left={info?.rarity !== 3 ? '-39%' : '-40%'}
          className={Open ? 'star-video' : 'no-video'}
        >
          <VideoStyled
            width='100%'
            height='100%'
            src={`/video/${info?.rarity}rarity.mp4`}
            autoPlay
            muted
            loop
            playsInline
          />
        </VideoBox>
      </PlanetInfoBox>
      <VideoBeginBox
        className={PlayingBegin && info?.rarity === 6 ? 'shock' : ''}
        display={PlayingBegin ? '' : 'none'}
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
        }}
        width='100%'
        height='100%'
      >
        <VideoStyled
          width='100%'
          height='100%'
          src={`/video/${info?.rarity}rarity-Begin.mp4`}
          autoPlay
          muted
          playsInline
        />
      </VideoBeginBox>
    </OutBox>
  );
};

export default BlindPlanetBox;
