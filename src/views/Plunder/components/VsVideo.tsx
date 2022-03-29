import React, { useState } from 'react';
import styled from 'styled-components';
import { Box, BoxProps } from 'uikit';

const BoxStyled = styled(Box)`
  width: 500px;
  height: 500px;
  /* object-fit: fill; */
  /* mix-blend-mode: screen; */
  background: transparent;
`;

const VideoStyled = styled.video`
  width: 100%;
  height: 100%;
  object-fit: fill;
  mix-blend-mode: screen;
  transform: translate3d(0, 0, 0);
  position: relative;
  z-index: -100;

  /* background: transparent; */
`;

const VsVideo: React.FC<BoxProps> = ({ ...props }) => {
  const [ended, setEnded] = useState(false);
  return (
    <BoxStyled {...props}>
      {ended ? (
        <VideoStyled loop autoPlay muted src='/video/pk-2.mp4' />
      ) : (
        <VideoStyled
          onEnded={() => {
            setEnded(true);
          }}
          autoPlay
          muted
          src='/video/pk-1.mp4'
        />
      )}
    </BoxStyled>
  );
};

export default VsVideo;
