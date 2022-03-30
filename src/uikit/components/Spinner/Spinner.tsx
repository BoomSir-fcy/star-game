import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Box, BoxProps } from '../Box';
import { Image } from '../Image';
import { SpinnerProps } from './types';

const Container = styled(Box)`
  position: relative;
  margin: 0 auto;
  position: relative;
  transform: translate3d(0, 0, 0);
  object-fit: fill;
  mix-blend-mode: screen;
  background: skyblue;
`;
const Spinner: React.FC<SpinnerProps> = ({ size = 500, ...props }) => {
  return (
    <Container width={size} height={size} {...props}>
      <Image width={size} height={size} src='/images/commons/loading.gif' />
    </Container>
  );
};

export default Spinner;
