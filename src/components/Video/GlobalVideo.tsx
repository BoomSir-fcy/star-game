import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  HTMLAttributes,
} from 'react';
import { Box, BoxProps } from 'uikit';
import styled from 'styled-components';
import { useVideo } from 'contexts/VideoContext';
import {
  position,
  layout,
  PositionProps,
  LayoutProps,
  margin,
  MarginProps,
} from 'styled-system';
import { useStore } from 'state';
import { APP_HEIGHT, APP_WIDTH, VIDEO_GLOBAL_CLASS_NAME } from 'config';

interface VideoSystem
  extends PositionProps,
    LayoutProps,
    MarginProps,
    HTMLAttributes<HTMLVideoElement> {
  center?: boolean;
  rotate?: number;
}

const BoxStyled = styled(Box)`
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
`;
const VideoStyled = styled.video<VideoSystem>`
  /* position: absolute; */
  ${layout}
  ${margin}
  object-fit: fill;
  mix-blend-mode: lighten;
  transform: ${({ rotate }) =>
    rotate ? `rotate(${rotate}deg) scale(1.5)` : 'scale(1.5)'};
  z-index: 999;
`;

export interface VideoGlobalProps extends BoxProps {
  width?: number;
  height?: number;
  src?: string;
  loop?: boolean;
  rotate?: number;
}
const GlobalVideo: React.FC<VideoGlobalProps> = ({
  width = 500,
  height = 500,
  src,
  loop,
  rotate,
  children,
  style,
  ...props
}) => {
  const { scale, client } = useStore(p => p.user);
  const [show, setShow] = useState(false);

  const { boxHeight, boxTop, boxWidth } = useMemo(() => {
    const _height = APP_HEIGHT * scale;
    const _width = APP_WIDTH * scale;
    const _top = (client.height - _height) / 2;
    return {
      boxHeight: _height,
      boxWidth: _width,
      boxTop: _top,
    };
  }, [client, scale]);

  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { current } = box;
    if (current) {
      const wrapper = document.querySelector(`.${VIDEO_GLOBAL_CLASS_NAME}`);
      if (wrapper) {
        wrapper.appendChild(current);
        setShow(true);
      }
    }
    return () => {
      if (current) {
        try {
          current?.parentElement?.removeChild(current);
        } catch (error) {
          console.error(error);
        }
      }
    };
  }, [box]);

  const { top, left, right, bottom } = props;
  return (
    <Box>
      <BoxStyled
        ref={box}
        position='absolute'
        // top={boxTop}
        height={boxHeight}
        width={boxWidth}
        // width='100%'
        style={{ display: show ? 'block' : 'none' }}
      >
        <Box
          {...props}
          position='absolute'
          width={`${width * scale}px`}
          height={`${height * scale}px`}
          top={typeof top === 'number' ? top * scale : top}
          left={typeof left === 'number' ? left * scale : left}
          bottom={typeof bottom === 'number' ? bottom * scale : bottom}
          right={typeof right === 'number' ? right * scale : right}
        >
          <VideoStyled
            width='100%'
            height='100%'
            src={src}
            autoPlay
            muted
            loop={loop}
            rotate={rotate}
            playsInline
            style={style}
          />
          {children}
        </Box>
      </BoxStyled>
    </Box>
  );
};

export default GlobalVideo;
