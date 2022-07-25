import React from 'react';
import { Box, BoxProps, Image } from 'uikit';
import { getVariantsSize } from 'components/StarCom/StyledStar';
import { Scale, variants } from 'components/StarCom/types';
import styled, { DefaultTheme } from 'styled-components';
import getThemeValue from 'uikit/util/getThemeValue';

const Planet = styled.div<{ url: string; color?: string }>`
  perspective: 400px;
  transform-style: preserve-3d;
  height: 100%;
  width: 100%;
  &.rotate {
    &::before {
      animation: rotate 10s linear infinite;
    }
  }
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0%;
    left: 0%;
    background: url(${({ url }) => url}) repeat-x;
    background-size: cover;
    border-radius: 50%;
    box-shadow: -20px 0px 20px 3px rgb(0 0 0 / 90%) inset,
      0px 0px 19px 7px ${({ color }) => color};

    @keyframes rotate {
      0% {
        background-position: 0% center;
      }
      100% {
        background-position: -200% center;
      }
    }
  }
`;

const IconUnion = styled(Image)<{ zIndex?: number | string }>`
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: ${({ zIndex }) => zIndex};
`;

export interface PlanetBallProps extends BoxProps {
  url: string;
  scale?: Scale;
  shadow?: string;
  rotate?: boolean;
  theme?: DefaultTheme;
  showUnion?: boolean;
  IconWidth?: number;
  IconHeight?: number;
}

const PlanetBall: React.FC<PlanetBallProps> = ({
  shadow = '#FFF',
  scale = 'md',
  rotate,
  url,
  theme,
  showUnion,
  IconWidth = 47,
  IconHeight = 45,
  ...props
}) => {
  const { width, height } = React.useMemo(() => {
    return getVariantsSize(variants.NONE, scale);
  }, [scale]);
  const getColor = React.useMemo(() => {
    return getThemeValue(`colors.${shadow}`, shadow)(theme);
  }, [theme, shadow]);

  return (
    <Box position='relative' width={width} height={height} {...props}>
      <Planet url={url} color={getColor} className={rotate ? 'rotate' : ''} />
      {showUnion && (
        <IconUnion
          width={IconWidth}
          height={IconHeight}
          src='/images/commons/icon/union.png'
        />
      )}
    </Box>
  );
};

export default PlanetBall;
