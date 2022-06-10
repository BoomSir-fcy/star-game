import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Box, BoxProps } from 'uikit';
import { getVariantsSize } from 'components/StarCom/StyledStar';
import { Scale, variants } from 'components/StarCom/types';
import Scene from './scene';

export interface GlobeProps extends BoxProps {
  url: string;
  scale?: Scale;
  shadow?: string;
  rotate?: boolean;
}

const Globe: React.FC<GlobeProps> = ({
  shadow,
  scale = 'md',
  rotate = true,
  url,
  ...props
}) => {
  const { width, height } = React.useMemo(() => {
    return getVariantsSize(variants.NONE, scale);
  }, [scale]);
  return (
    <Box width={width} height={height} {...props}>
      <Canvas resize={{ offsetSize: true }}>
        <Scene rotate={rotate} shadow={shadow} url={url} />
      </Canvas>
    </Box>
  );
};

export default Globe;
