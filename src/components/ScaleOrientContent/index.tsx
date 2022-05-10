import StarrySky from 'components/StarrySky';
import { VideoComponent } from 'components/Video';
import { APP_HEIGHT, APP_WIDTH, VIDEO_GLOBAL_CLASS_NAME } from 'config';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { setGlobalClient, setGlobalScale } from 'state/user/actions';
import styled from 'styled-components';
import { Box } from 'uikit';
import detectOrient from 'utils/detectOrient';

import Dashboard from 'components/Dashboard';

const Content = styled(Box)<{ scale: number }>`
  width: 1920px;
  height: 900px;
  transform-origin: 0 0;
  position: absolute;
  top: 48%;
  left: 50%;
  /* background: pink; */
  transform: ${({ scale }) =>
    `translate(${-scale * 50}%, ${-scale * 50}%) scale(${scale})`};
`;

const ScaleOrientContent: React.FC = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  const [minHeight, setMinHeight] = useState(900);
  const [cHeight, setCHeight] = useState(900);
  const [scale, setScale] = useState(1);

  const dispatch = useDispatch();

  const handleResize = useCallback(() => {
    const { clientHeight, clientWidth } = window.document.body;

    const maxV = Math.max(clientWidth, clientHeight);
    const minV = Math.min(clientWidth, clientHeight);
    const rateMax = maxV / APP_WIDTH;
    const rateMin = minV / APP_HEIGHT;

    // 处理高度不够显示不全bug
    const rate = Math.min(rateMax, rateMin);

    console.log(rateMax, rateMin);

    // dispatch(setScale)
    setScale(rate);
    setMinHeight(Math.min(clientWidth, clientHeight));
    setCHeight(clientHeight);

    dispatch(
      setGlobalClient({
        width: clientWidth,
        height: clientHeight,
      }),
    );
    dispatch(setGlobalScale(rate));
    if (ref.current) {
      detectOrient(ref.current, false);
    }
  }, [ref, dispatch]);

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
      <VideoComponent
        cHeight={APP_HEIGHT}
        minHeight={minHeight}
        scale={scale}
      />
      <div className={VIDEO_GLOBAL_CLASS_NAME} />
      <Content id='scale-content' scale={scale}>
        <Dashboard />
        {children}
      </Content>
      {/* <Box>
      </Box> */}
    </Box>
  );
};

export default ScaleOrientContent;
