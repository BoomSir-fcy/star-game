import React from 'react';
import styled from 'styled-components';
import { space } from 'styled-system';
import { FlexProps, Flex } from '../Box';

const LabelBox = styled(Flex)`
  background: ${({ theme }) => theme.colors.input};
  height: 81px;
  box-shadow: ${({ theme }) => theme.shadows.inset};
  border-radius: ${({ theme }) => theme.radii.tag};
  padding-left: 59px;
  align-items: center;
  ${space}
`;

const Label: React.FC<FlexProps> = ({ children, ...props }) => {
  return <LabelBox {...props}>{children}</LabelBox>;
};

export default Label;
