import React from 'react';
import styled from 'styled-components';
import { Box, BoxProps } from '../Box';

const ProgressBox = styled(Box)<{ step: string }>`
  width: 537px;
  height: 16px;
  background: url('/images/plunder/bar.png');
  background-size: 100% 100%;
  position: relative;
  &::before {
    content: '';
    max-width: calc(100% - 10px);
    width: ${({ step }) => step};
    height: 10px;
    position: absolute;
    top: 0;
    left: 5px;
    bottom: 0;
    right: auto;
    margin: auto;
    background: linear-gradient(
      45deg,
      #d11812 25%,
      #d3514c 0,
      #d3514c 50%,
      #d11812 0,
      #d11812 75%,
      #d3514c 0
    );
    background-size: 10px;
    box-shadow: 0px 4px 18px 0px rgba(0, 0, 0, 0.31);
    border-radius: 6px;
    transition: width 0.2s ease-out;
  }
`;

interface StripedProgressProps extends BoxProps {
  step?: string;
}
const StripedProgress: React.FC<StripedProgressProps> = ({
  step,
  ...props
}) => {
  return <ProgressBox step={step} {...props} />;
};

export default StripedProgress;
