import React from 'react';
import { Box } from 'uikit';
import styled from 'styled-components';
import { useVideo } from 'contexts/VideoContext';

const VideoStyled = styled.video<{
  width?: string;
  height?: string;
  zIndex?: number;
  top: number | string;
  left: number | string;
}>`
  position: fixed;
  top: ${({ top }) => top};
  left: ${({ left }) => left};
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  object-fit: fill;
  mix-blend-mode: lighten;
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
  return (
    <>
      {show && (
        <Box>
          <VideoStyled
            ref={videoRef}
            width={`calc(${videoOptions.width}px * ${scale})`}
            height={`calc(${videoOptions.height}px * ${scale})`}
            src={videoOptions.src}
            zIndex={videoOptions.zIndex}
            top={videoOptions.top}
            left={videoOptions.left}
            loop={videoOptions.loop}
            autoPlay
            muted
          />
        </Box>
      )}
    </>
  );
};
