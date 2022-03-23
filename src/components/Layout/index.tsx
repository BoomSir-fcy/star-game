import React from 'react';
import styled from 'styled-components';
import { Box } from 'uikit';
import Dashboard from 'components/Dashboard';

const Layout: React.FC = ({ children }) => {
  return (
    <Box width='100%' height='100%'>
      <Dashboard />
      {children}
    </Box>
  );
};

export default Layout;
