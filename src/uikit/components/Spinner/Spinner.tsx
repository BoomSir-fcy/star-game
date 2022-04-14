import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { LoadingIcon } from 'uikit';
import { Box, BoxProps } from '../Box';
import { Image } from '../Image';
import { SpinnerProps } from './types';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;
const Spinner: React.FC<SpinnerProps> = ({ size = 100, ...props }) => {
  return (
    <Container width={size} height={size} {...props}>
      {/* <Image width={size} height={size} src='/images/commons/loading.gif' /> */}
      <LoadingIcon width={size} color='#41B7FF' />
    </Container>
  );
};

export default Spinner;
