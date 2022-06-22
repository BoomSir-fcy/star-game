import React from 'react';
import styled from 'styled-components';
import { Box, BoxProps } from 'uikit';
// import Dashboard from 'components/Dashboard';

const Layout: React.FC<BoxProps> = ({ ...props }) => {
  return <Box width='100%' height='100%' {...props} />;
};

export default Layout;
