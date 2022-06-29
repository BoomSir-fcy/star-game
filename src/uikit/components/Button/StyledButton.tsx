import styled, { DefaultTheme } from 'styled-components';
import { space, layout, variant } from 'styled-system';
import { scaleVariants, styleVariants } from './theme';
import { BaseButtonProps } from './types';

interface ThemedButtonProps extends BaseButtonProps {
  theme: DefaultTheme;
}

interface TransientButtonProps extends ThemedButtonProps {
  $isLoading?: boolean;
}

const getDisabledStyles = ({ $isLoading, theme }: TransientButtonProps) => {
  if ($isLoading === true) {
    return `
      &:disabled,
      &.pancake-button--disabled {
        cursor: progress;
      }
    `;
  }

  return `
    &:disabled,
    &.pancake-button--disabled {
      // background-repeat: no-repeat;
      // background-position: 0 0px, 10px 0px, 100% -1px;
      // background-size: 20px 36px, calc(100% - 20px) 36px, 20px 38px;
      
      background: #161920;
      border-color: ${theme.colors.backgroundDisabled};
      box-shadow: none;
      color: white;
      // color: ${theme.colors.textDisabled};
      cursor: not-allowed;
    }
  `;
};

/**
 * This is to get around an issue where if you use a Link component
 * React will throw a invalid DOM attribute error
 * @see https://github.com/styled-components/styled-components/issues/135
 */

const getOpacity = ({ $isLoading = false }: TransientButtonProps) => {
  return $isLoading ? '.8' : '1';
};

const StyledButton = styled.button<BaseButtonProps>`
  align-items: center;
  border: 0;
  border-radius: 16px;
  box-shadow: 0px -3px 0px 0px rgba(14, 14, 44, 0.4) inset;
  cursor: pointer;
  display: inline-flex;
  font-family: inherit;
  font-size: 28px;
  font-weight: 600;
  justify-content: center;
  letter-spacing: 0.03em;
  line-height: 1;
  opacity: ${getOpacity};
  outline: 0;
  /* transition: filter 0.2s, filter 0.2s; */

  &:hover:not(:disabled):not(.pancake-button--disabled):not(.pancake-button--disabled):not(:active) {
    /* opacity: 0.8; */
    filter: brightness(0.9);
  }

  &:active:not(:disabled):not(.pancake-button--disabled):not(.pancake-button--disabled) {
    /* opacity: 0.85; */
    filter: brightness(0.95);
    transform: translateY(2px);
    /* box-shadow: none; */
  }

  ${getDisabledStyles}
  ${variant({
    prop: 'scale',
    variants: scaleVariants,
  })}
  background-size: 100% 100%;
  ${variant({
    variants: styleVariants,
  })}
  ${layout}
  ${space}
`;

export default StyledButton;
