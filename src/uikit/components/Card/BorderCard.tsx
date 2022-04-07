import styled, { ThemeConsumer } from 'styled-components';
import { space, layout, border, position } from 'styled-system';
import { BorderCardProps } from './types';

const BorderCard = styled.div<BorderCardProps>`
  border: ${({ isActive, borderWidth, theme }) =>
    `${borderWidth}px solid ${
      isActive ? theme.colors.lightBorder : 'transparent'
    }`};
  box-shadow: ${({ isActive, theme }) =>
    isActive ? theme.shadows.highlight : 'none'};
  ${position}
  ${space}
  ${layout}
  ${border}
`;

BorderCard.defaultProps = {
  borderWidth: 4,
};

export default BorderCard;
