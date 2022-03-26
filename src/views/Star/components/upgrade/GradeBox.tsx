import React from 'react';
import styled from 'styled-components';
import { Flex, FlexProps } from 'uikit';

const StyledGradeBox = styled(Flex)`
  position: relative;
  justify-content: center;
  align-items: center;
  width: 94px;
  height: 104px;
  background: url('/images/commons/star/grade.png') no-repeat;
  background-size: 100%;
`;
export const GradeBox: React.FC<FlexProps> = ({ children }) => {
  return <StyledGradeBox>{children}</StyledGradeBox>;
};
