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
      opacity: 0;
    }
  }
`;

interface BeginVideoProps extends BoxProps {
  isEnd: () => void;
}

const BeginVideo: React.FC<BeginVideoProps> = ({ isEnd, ...props }) => {
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
      />
    </Box>
  );
};

export default BeginVideo;
