import React from 'react';
import styled from 'styled-components';
import { Box, BoxProps } from '../Box';
import { Text } from '../Text';

interface InputPanelStyledProps extends BoxProps {
  isWarning?: boolean;
  background?: string;
  warning?: React.ReactNode;
}

// const getBoxShadow = ({ isWarning = false, theme }) => {
//   if (isWarning) {
//     return theme.shadows.warning;
//   }

//   return theme.colors.inpuShadows;
// };

const StyledErrorMessage = styled(Text)`
  position: absolute;
  bottom: -22px;
  a {
    display: inline;
  }
`;
const InputPanelStyled = styled(Box)<InputPanelStyledProps>`
  border-radius: 16px;
  background-color: ${({ theme }) => theme.colors.backgroundCard};
  position: relative;
  padding: 8px 20px;
`;
// box-shadow: ${getBoxShadow};

export default function InputPanel({
  children,
  isWarning,
  warning,
  ...props
}: InputPanelStyledProps) {
  return (
    <InputPanelStyled isWarning={isWarning} {...props}>
      {children}
      {isWarning && (
        <StyledErrorMessage fontSize='14px' color='failure'>
          {warning}
        </StyledErrorMessage>
      )}
    </InputPanelStyled>
  );
}
