import styled, { DefaultTheme } from 'styled-components';
import { space } from 'styled-system';
import { NavProps } from './types';

interface StyledNavProps extends NavProps {
  theme: DefaultTheme;
}

const StyledNav = styled.div<StyledNavProps>`
  overflow: hidden;
  position: relative;
  background: url('/images/commons/nav/bg.png');
  background-size: 100% 100%;
  width: 251px;
  height: 558px;
  padding-top: 28px;
  padding-left: 32px;
  ${space}
`;

export default StyledNav;
