import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Box, BoxProps } from 'uikit';
import { DefaultTheme } from 'styled-components';
import Scene from './scene';

export interface GlobeProps extends BoxProps {
  width: string;
  height: string;
  url: string;
  shadow?: string;
}

const Globe: React.FC<GlobeProps> = ({
  width,
  height,
  shadow,
  url,
  ...props
}) => {
  return (
    <Box width={width} height={height} {...props}>
      <Canvas resize={{ offsetSize: true }}>
        <Scene shadow={shadow} url={url} />
      </Canvas>
    </Box>
  );
};

export default Globe;
