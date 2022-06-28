import React from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { Box, Flex } from 'uikit';

export const GalaxyBox = styled(Box)`
  position: relative;
  width: 100%;
  height: 100vh;
  margin: auto;
  &.no-select {
    user-select: none;
  }
`;
