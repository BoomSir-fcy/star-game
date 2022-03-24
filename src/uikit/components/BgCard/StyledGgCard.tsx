import styled, { DefaultTheme } from 'styled-components';
import { space, variant } from 'styled-system';
import { styleVariants } from './theme';
import { BgCardProps } from './types';

interface StyledBgCardProps extends BgCardProps {
  theme: DefaultTheme;
}

const StyledBgCard = styled.div<StyledBgCardProps>`
  overflow: hidden;
  position: relative;

  ${variant({
    variants: styleVariants,
  })}
  ${space}
`;

StyledBgCard.defaultProps = {
  variant: 'medium',
};

export default StyledBgCard;
