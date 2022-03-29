import styled from 'styled-components';
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
`;

Bar.defaultProps = {
  primary: false,
};

interface StyledProgressProps {
  variant: ProgressProps['variant'];
  scale: ProgressProps['scale'];
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
