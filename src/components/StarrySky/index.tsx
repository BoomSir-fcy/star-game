import React from 'react';
import styled from 'styled-components';
import { Box } from 'uikit';
import skyBg0 from 'assets/img/commons/sky-bg0.png';
import skyBg1 from 'assets/img/commons/sky-bg1.jpg';
import './spiders.css';

export const backgroundVariants = [skyBg0, skyBg1];

const getBackground = ({ type }: { type: number }) => {
  if (backgroundVariants[type]) {
    const backgroundImage = backgroundVariants[type];

    return `
      background: url(${backgroundImage}) no-repeat right;
      background-size: cover;
    `;
  }
  return `
    background: url(${backgroundVariants[0]}) no-repeat right;
    background-size: cover;

  `;
};

const StarrySkyBg = styled(Box)<{ bgType: number }>`
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  ${({ bgType }) => getBackground({ type: bgType })}
`;

interface StarrySkyProps {
  bgType?: number;
}

const StarrySky: React.FC<StarrySkyProps> = ({ bgType = 0 }) => {
  return (
    <StarrySkyBg bgType={bgType}>
      <div className='spiders'>
        <div className='spidersOne' />
        <div className='spidersTwo' />
        <div className='spidersThree' />
      </div>
    </StarrySkyBg>
  );
};

export default StarrySky;
