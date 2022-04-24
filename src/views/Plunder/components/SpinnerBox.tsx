import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Box, BoxProps } from 'uikit';
import useVideo from 'contexts/VideoContext/useVideo';

const SpinnerBox: React.FC<BoxProps> = ({ ...props }) => {
  const { setVideoOptions, videoRef } = useVideo();

  React.useEffect(() => {
    setVideoOptions({
      src: '/video/loading.mp4',
      center: false,
      top: 300,
      right: 0,
    });
  }, [videoRef, setVideoOptions]);

  return null;
};

export default SpinnerBox;
