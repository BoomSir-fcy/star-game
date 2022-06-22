import React, { useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Box } from 'uikit';
import SkyCanvas from './SkyCanvas';

const SkyBox = styled(Box)`
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: #000;
  transform: translate3d(0, 0, 0);
  transform: translateZ(-1px);
  overflow: hidden;
`;
const MaskImg = styled(Box)`
  width: 100%;
  background: url(/images/commons/mask.jpg) no-repeat;
  background-size: cover;
  height: 100%;
  position: absolute;
  z-index: 10;
  opacity: 0.4;
`;
const Canvas = styled.canvas`
  width: 100%;
  height: auto /*默认全屏显示 可自己设置高度640px*/;
  display: inline-block;
  vertical-align: baseline;
  position: absolute;
`;

const SkyBgCanvas = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const cvRef = useRef(null);

  const handleCliebtSize = useCallback(() => {
    if (cvRef.current) {
      cvRef.current.setCliebtSize();
    }
  }, [cvRef]);

  useEffect(() => {
    if (ref.current) {
      const canvas = new SkyCanvas(ref.current);
      cvRef.current = canvas;
      canvas.animation();
    }

    window.addEventListener('load', handleCliebtSize);
    window.addEventListener('resize', handleCliebtSize);
    return () => {
      window.removeEventListener('load', handleCliebtSize);
      window.removeEventListener('resize', handleCliebtSize);
    };
  }, [ref, handleCliebtSize]);
  return (
    <SkyBox>
      <MaskImg />
      <Canvas ref={ref} id='canvas' />
    </SkyBox>
  );
};

export default SkyBgCanvas;
