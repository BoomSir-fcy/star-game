import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Box } from 'uikit';
import styled from 'styled-components';
import { useVideo } from 'contexts/VideoContext';
import { position, layout, PositionProps, LayoutProps } from 'styled-system';

interface VideoSystes extends PositionProps, LayoutProps {
  center?: boolean;
}
const VideoStyled = styled.video<VideoSystes>`
  position: absolute;
  ${layout}
  object-fit: fill;
  mix-blend-mode: lighten;
  ${({ center }) =>
    center
      ? `
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  `
      : position}
  z-index: ${({ zIndex }) => zIndex};
`;

interface VideoComponentProps {
  scale: number;
}
export const VideoComponent: React.FC<VideoComponentProps> = ({
  scale,
  ...props
}) => {
  const { show, videoOptions, videoRef } = useVideo();

  const { boxHeight, boxTop } = useMemo(() => {
    const { width, height } =
      window.document.documentElement.getBoundingClientRect();

    const _height = 900 * scale;
    const _top = (height - _height) / 2;
    return {
      boxHeight: _height,
      boxTop: _top,
    };
  }, [scale]);
  return (
    <>
      {show && (
        <Box position='absolute' top={boxTop} height={boxHeight} width='100%'>
          <VideoStyled
            ref={videoRef}
            width={`calc(${videoOptions.width}px * ${scale})`}
            height={`calc(${videoOptions.height}px * ${scale})`}
            src={videoOptions.src}
            zIndex={videoOptions.zIndex}
            top={
              typeof videoOptions.top === 'number'
                ? videoOptions.top * scale
                : videoOptions.top
            }
            left={
              typeof videoOptions.left === 'number'
                ? videoOptions.left * scale
                : videoOptions.left
            }
            center={videoOptions.center}
            loop={videoOptions.loop}
            autoPlay
            muted
          />
        </Box>
      )}
    </>
  );
};
