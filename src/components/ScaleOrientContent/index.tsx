import StarrySky from 'components/StarrySky';
import { VideoComponent } from 'components/Video';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Box } from 'uikit';
import detectOrient from 'utils/detectOrient';

const Content = styled(Box)<{ scale: number }>`
  width: 1920px;
  height: 900px;
  transform-origin: 0 0;
  /* z-index: 0; */
  position: absolute;
  top: 50%;
  left: 50%;
  /* background: pink; */
  transform: ${({ scale }) =>
    `translate(${-scale * 50}%, ${-scale * 50}%) scale(${scale})`};
`;

const ScaleOrientContent: React.FC = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  const [minHeight, setMinHeight] = useState(900);
  const [scale, setScale] = useState(1);
  const handleResize = useCallback(() => {
    const { width, height } =
      window.document.documentElement.getBoundingClientRect();
    const maxV = Math.max(width, height);
    const rate = maxV / 1920;
    setScale(rate);
    setMinHeight(Math.min(width, height));
    if (ref.current) {
      detectOrient(ref.current, false);
    }
  }, [ref]);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  return (
    <Box position='relative' id='detect-orient' ref={ref}>
      <StarrySky bgType={pathname === '/plant-league' ? 2 : 0} />
      {/* <VideoComponent minHeight={minHeight} scale={scale} /> */}
      <Content id='scale-content' scale={scale}>
        {children}
      </Content>
    </Box>
  );
};

export default ScaleOrientContent;
