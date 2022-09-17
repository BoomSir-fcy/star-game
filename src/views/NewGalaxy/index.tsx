import React, { useState } from 'react';
import { Text, Flex, Box } from 'uikit';
import GalaxyInfo from './components/GalaxyInfo.tsx';
import TopCarousel from './components/TopCarousel';
import { GalaxyBox } from './style';

const NewGalaxy: React.FC = () => {
  return (
    <GalaxyBox>
      <TopCarousel />
      <GalaxyInfo />
    </GalaxyBox>
  );
};

export default NewGalaxy;
