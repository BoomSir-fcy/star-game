import styled, { DefaultTheme } from 'styled-components';
import { space, variant as variantStyled } from 'styled-system';
import { qualities } from 'uikit/theme/types';
import { styleVariants, scaleVariants } from './theme';
import { scales, StarProps, variants, Variant, Scale } from './types';

interface StyledStarComProps extends StarProps {
  theme: DefaultTheme;
}

const getBoxShadow = ({ theme, quality, variant }: StyledStarComProps) => {
  if (variant === variants.NONE) {
    return 'none';
  }
  const color = theme.colors[quality || qualities.ORDINARY];

  return `0px 0px 8px 0px ${color}, 0px 0px 0px 0.5px #ffffff, inset 0px 0px 5px 1px ${color}`;
};

export const getVariantsSize = (
  variant: Variant = variants.SQUARE,
  scale: Scale = scales.MD,
) => {
  if (variant === variants.SQUARE) {
    const { width, height } = scaleVariants[scale];
    return { width, height };
  }
  if (variant === variants.RING) {
    const { rWidth: width, rHeight: height } = scaleVariants[scale];
    return { width, height };
  }
  const { sWidth, sHeight } = scaleVariants[scale];
  return { width: sWidth, height: sHeight };
};

export const getSize = ({
  theme,
  variant = variants.SQUARE,
  scale = scales.MD,
}: StyledStarComProps) => {
  const { width, height } = getVariantsSize(variant, scale);
  return `
  width: ${width}px;
  height: ${height}px;
`;
};

const StyledStarCom = styled.div<StyledStarComProps>`
  position: relative;
  /* width: 165px;
  height: 165px; */
  border: 1px solid;
  /* border-radius: 10px; */
  color: ${({ theme, quality }) => theme.colors[quality || qualities.ORDINARY]};
  box-shadow: ${getBoxShadow};
  ${getSize}
  ${space}
  ${variantStyled({
    prop: 'variant',
    variants: styleVariants,
  })}
`;

StyledStarCom.defaultProps = {
  quality: qualities.ORDINARY,
  variant: variants.SQUARE,
  scale: scales.MD,
};

export default StyledStarCom;
