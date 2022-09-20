import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Box, BoxProps } from 'uikit';

const VideoStyled = styled.video`
  width: 1920px;
  /* object-fit: fill; */
  /* position: absolute;
  top: 0; */
  object-fit: fill;
  mix-blend-mode: screen;
  animation: fadeOut 4s linear;
  opacity: 0;
  @keyframes fadeOut {
    0% {
      opacity: 0.8;
    }
    50% {
      opacity: 1;
    }
    80% {
      opacity: 0.9;
    }
    100% {
      opacity: 0.01;
    }
  }
`;

interface BeginVideoProps extends BoxProps {
  isEnd: () => void;
  isPlaying: () => void;
}

const BeginVideo: React.FC<BeginVideoProps> = ({
  isEnd,
  isPlaying,
  ...props
}) => {
  const [isErr, setisErr] = useState(false);
  const [isPlay, setisPlay] = useState(false);
  useEffect(() => {
    if (!isErr && isPlay) {
      isPlaying();
    }
  }, [isErr, isPlay, isPlaying]);
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    if (!timer) {
      setTimer(
        setTimeout(() => {
          if (isEnd) isEnd();
        }, 6000),
      );
    }
  }, [isEnd, timer]);

  return (
    <Box
      width={1920}
      height={1080}
      overflow='hidden'
      position='relative'
      {...props}
    >
      <VideoStyled
        autoPlay
        muted
        src='/video/battleReplay.mp4'
        playsInline
        onEnded={isEnd}
        id='battleReplay'
        onPlay={() => {
          setisPlay(true);
        }}
        onError={() => {
          setisErr(true);
        }}
      />
    </Box>
  );
};

export default BeginVideo;
