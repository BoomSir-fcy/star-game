import styled, { DefaultTheme } from 'styled-components';
import { space, layout } from 'styled-system';

import { InputProps, scales } from './types';

interface StyledInputProps extends InputProps {
  theme: DefaultTheme;
}

/**
 * Priority: Warning --> Success
 */
const getBoxShadow = ({
  isSuccess = false,
  isWarning = false,
  noShadow = false,
  primary = false,
  theme,
}: StyledInputProps) => {
  if (isWarning) {
    return theme.shadows.warning;
  }

  if (noShadow) {
    return 'none';
  }

  if (isSuccess) {
    return theme.shadows.success;
  }

  if (primary) {
    return theme.shadows.primary;
  }

  return theme.shadows.inset;
};

const getHeight = ({ scale = scales.MD }: StyledInputProps) => {
  switch (scale) {
    case scales.SM:
      return '32px';
    case scales.LG:
      return '48px';
    case scales.MD:
    default:
      return '40px';
  }
};

const Input = styled.input<InputProps>`
  background-color: ${({ theme }) => theme.colors.input};
  border: 0;
  border-radius: 16px;
  box-shadow: ${getBoxShadow};
  color: ${({ theme }) => theme.colors.text};
  display: block;
  font-size: 28px;
  height: ${getHeight};
  outline: 0;
  padding: 0;
  width: 100%;
  border: none;
  ${({ primary }) => primary && `border: 2px solid;`}

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSubtle};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.backgroundDisabled};
    box-shadow: none;
    color: ${({ theme }) => theme.colors.textDisabled};
    cursor: not-allowed;
  }
  &:read-only {
    box-shadow: none;
  }

  &:focus:not(:disabled):not(:readonly) {
    box-shadow: none;
  }
  ${space}
  ${layout}
`;

Input.defaultProps = {
  scale: scales.MD,
  isSuccess: false,
  isWarning: false,
};

export default Input;
