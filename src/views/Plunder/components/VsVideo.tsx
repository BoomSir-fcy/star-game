import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Box, BoxProps } from 'uikit';
import useVideo from 'contexts/VideoContext/useVideo';

const BoxStyled = styled(Box)`
  width: 500px;
  height: 500px;
  /* object-fit: fill; */
  /* mix-blend-mode: screen; */
  background: transparent;
`;

const VideoStyled = styled.video`
  width: 1px;
  height: 1px;
  position: fixed;
  visibility: hidden;
`;

const VsVideo: React.FC<BoxProps> = ({ ...props }) => {
  const [ended, setEnded] = useState(false);

  const { setVideoOptions, videoRef } = useVideo();

  const changeState = useCallback(() => {
    console.log(9999);
    setVideoOptions({
      src: '/video/pk-2.mp4',
      loop: true,
      center: true,
    });
  }, [setVideoOptions]);

  React.useEffect(() => {
    setVideoOptions({
      src: '/video/pk-1.mp4',
      center: true,
      loop: false,
    });
    const refCurrent = videoRef.current;
    if (refCurrent) {
      refCurrent.addEventListener('ended', changeState);
    }
    return () => {
      if (refCurrent) {
        refCurrent.removeEventListener('ended', changeState);
      }
    };
  }, [videoRef, setVideoOptions, changeState]);

  return (
    <div>
      <VideoStyled src='/video/pk-2.mp4' />
      <VideoStyled src='/video/pk-1.mp4' />
    </div>
  );
};

export default VsVideo;
