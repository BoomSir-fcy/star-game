import styled, { DefaultTheme } from 'styled-components';
import { space, variant as variantStyled } from 'styled-system';
import { styleVariants } from './theme';
import { BgCardProps } from './types';

interface StyledBgCardProps extends BgCardProps {
  theme: DefaultTheme;
}

const StyledBgCard = styled.div<StyledBgCardProps>`
  overflow: hidden;
  position: relative;
  ${variantStyled({
    variants: styleVariants,
  })}
  ${space}
`;

export default StyledBgCard;
