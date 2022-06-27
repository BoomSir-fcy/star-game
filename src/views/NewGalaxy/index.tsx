import React, { useState } from 'react';
import { Text, Flex, Box } from 'uikit';
import TopCarousel from './components/TopCarousel';
import { GalaxyBox } from './style';

const NewGalaxy: React.FC = () => {
  return (
    <GalaxyBox>
      <TopCarousel />
    </GalaxyBox>
  );
};

export default NewGalaxy;
