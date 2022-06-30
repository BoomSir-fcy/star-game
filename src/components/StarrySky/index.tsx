import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Box } from 'uikit';
import SkyBgCanvas from './skyCanvas';
import './spiders.css';

export const backgroundVariants = [
  '/images/commons/sky-bg0.png',
  '/images/commons/sky-bg1.jpg',
  '/images/commons/sky-bg2.png',
  '/images/commons/sky-bg3.png',
  '/images/commons/sky-bg4.png',
  '/images/commons/sky-bg5.png',
];

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
  transform: translate3d(0, 0, 0);
  transform: translateZ(-1px);
  overflow: hidden;
`;

interface StarrySkyProps {
  bgType?: number;
}

const StarrySky: React.FC<StarrySkyProps> = ({ bgType = 0 }) => {
  const type = useMemo(() => {
    return bgType;
  }, [bgType]);
  return (
    <>
      {type === 3 ? (
        <SkyBgCanvas />
      ) : (
        <StarrySkyBg bgType={type}>
          <div className='spiders'>
            <div className='spidersOne' />
            <div className='spidersTwo' />
            <div className='spidersThree' />
          </div>
        </StarrySkyBg>
      )}
    </>
  );
};

export default StarrySky;
