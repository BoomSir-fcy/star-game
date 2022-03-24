import styled, { DefaultTheme } from 'styled-components';
import { space, variant as variantStyled } from 'styled-system';
import { qualities } from 'uikit/theme/types';
import { styleVariants, scaleVariants } from './theme';
import { scales, StarProps, variants } from './types';

interface StyledStarComProps extends StarProps {
  theme: DefaultTheme;
}

const getBoxShadow = ({ theme, quality }: StyledStarComProps) => {
  const color = theme.colors[quality || qualities.ORDINARY];

  return `0px 0px 8px 0px ${color}, 0px 0px 0px 0.5px #ffffff, inset 0px 0px 5px 1px ${color}`;
};

const getSize = ({
  theme,
  variant = variants.SQUARE,
  scale = scales.MD,
}: StyledStarComProps) => {
  if (variant === variants.SQUARE) {
    const { width, height } = scaleVariants[scale];
    return `
      width: ${width};
      height: ${height};
    `;
  }
  if (variant === variants.RING) {
    const { rWidth, rHeight } = scaleVariants[scale];
    return `
      width: ${rWidth};
      height: ${rHeight};
    `;
  }
  const { sWidth, sHeight } = scaleVariants[scale];
  return `
    width: ${sWidth};
    height: ${sHeight};
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
