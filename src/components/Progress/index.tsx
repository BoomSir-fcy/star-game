import React from 'react';
import { LayoutProps } from 'styled-system';
import { Progressbar, Bar } from './styled';
import { BarProps } from './types';

const Progress: React.FC<BarProps> = ({ ...props }) => {
  return (
    <Progressbar>
      <Bar {...props} />
    </Progressbar>
  );
};

export default Progress;
