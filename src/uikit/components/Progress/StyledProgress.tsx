import styled, { css } from 'styled-components';
import { space, variant as StyledSystemVariant } from 'styled-system';
import getThemeValue from 'uikit/util/getThemeValue';
import { styleVariants, styleScales } from './themes';
import { ProgressProps, variants } from './types';

interface BarProps {
  primary?: boolean;
  color?: string;
}

export const Bar = styled.div<BarProps>`
  position: absolute;
  top: 0;
  left: 0;
  background: ${({ theme, color }) =>
    getThemeValue(`colors.${color}`, color)(theme) ||
    theme.colors.gradients.progress};
  height: 100%;
  transition: width 200ms ease;
  z-index: 1;
`;

Bar.defaultProps = {
  primary: false,
};

interface StyledProgressProps {
  variant: ProgressProps['variant'];
  scale: ProgressProps['scale'];
  linear?: boolean;
}

const StyledProgress = styled.div<StyledProgressProps>`
  position: relative;
  background: ${({ theme }) => theme.colors.gradients.progress};
  box-shadow: ${({ theme }) => theme.shadows.inset};
  overflow: hidden;

  ${Bar} {
    border-radius: ${({ variant }) =>
      variant === variants.FLAT ? '0' : '32px'};
    /* border-top-left-radius: ${({ variant }) =>
      variant === variants.FLAT ? '0' : '32px'}; */
    /* border-bottom-left-radius: ${({ variant }) =>
      variant === variants.FLAT ? '0' : '32px'}; */
  }

  ${({ linear }) => {
    return linear
      ? `
      background: #161920;
      background-size: 10px 10px;
      background-image: linear-gradient(
        45deg,
        rgba(31, 34, 40, 0.5) 25%,
        transparent 25%,
        transparent 50%,
        rgba(31, 34, 40, 0.5) 50%,
        rgba(31, 34, 40, 0.5) 75%,
        transparent 75%,
        transparent
      );
    `
      : '';
  }};

  ${StyledSystemVariant({
    variants: styleVariants,
  })}
  ${StyledSystemVariant({
    prop: 'scale',
    variants: styleScales,
  })}
  ${space}
`;

export default StyledProgress;
