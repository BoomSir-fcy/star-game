import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Box, BoxProps, Image } from 'uikit';
import { getVariantsSize } from 'components/StarCom/StyledStar';
import { Scale, variants } from 'components/StarCom/types';
import styled, { keyframes, DefaultTheme } from 'styled-components';
import getThemeValue from 'uikit/util/getThemeValue';
// import Scene from './scene';

const planetRotate = keyframes`
  0% {
    background-position: 0% center;
  }
  100% {
      background-position: -200% center;
  }
`;
const PlanetBox = styled(Box)<{ color?: string }>`
  /* height: 190px;
  width: 190px; */
  position: relative;
  background: radial-gradient(
    circle at 30% 50%,
    rgba(255, 255, 255, 0.3) 0%,
    rgba(255, 255, 255, 0) 65%
  );
  border-radius: 50%;
  box-shadow: inset 10px 0px 12px -2px rgba(255, 255, 255, 0.2),
    inset -30px 0px 50px 0px black, 0px 0px 20px 6px ${({ color }) => color};
  overflow: hidden;
`;
const Planet = styled(Box)<{ url: string }>`
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: -1;
  background-size: cover;
  background-image: url(${({ url }) => url});
  transform: rotate(0deg) scale(1.2);
  &.rotate {
    animation: ${planetRotate} calc(153.3 * 0.1s) linear infinite;
  }
`;
const IconUnion = styled(Image)<{ zIndex?: number | string }>`
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: ${({ zIndex }) => zIndex};
`;

export interface GlobeProps extends BoxProps {
  url: string;
  scale?: Scale;
  shadow?: string;
  rotate?: boolean;
  theme?: DefaultTheme;
  showUnion?: boolean;
  zIndex?: number | string;
}

const Globe: React.FC<GlobeProps> = ({
  shadow = '#FFF',
  scale = 'md',
  rotate,
  url,
  theme,
  showUnion,
  zIndex = 'auto',
  ...props
}) => {
  const { width, height } = React.useMemo(() => {
    return getVariantsSize(variants.NONE, scale);
  }, [scale]);
  const getColor = React.useMemo(() => {
    return getThemeValue(`colors.${shadow}`, shadow)(theme);
  }, [theme, shadow]);

  return (
    <Box position='relative'>
      <PlanetBox
        zIndex={zIndex}
        width={width}
        height={height}
        color={getColor}
        {...props}
      >
        <Planet url={url} className={rotate ? 'rotate' : ''} />
      </PlanetBox>
      {showUnion && (
        <IconUnion
          zIndex={zIndex}
          width={47}
          height={45}
          src='/images/commons/icon/union.png'
        />
      )}
    </Box>
  );
};

export default Globe;
