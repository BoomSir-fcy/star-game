import { Globe } from 'components';
import StarCom from 'components/StarCom';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styled, { keyframes } from 'styled-components';
import { Box, Button, Flex, Text } from 'uikit';
import { useImmer } from 'use-immer';

const ParentBox = styled(Box)`
  width: 500px;
  height: 600px;
  padding: 10px;
  margin: auto;
  border: 5px solid black;
  overflow: auto;
  cursor: move;

  &.no-select {
    user-select: none;
  }
  ::-webkit-scrollbar {
    width: 0px;
    height: 0px;
  }
`;
const ChilrdenBox = styled(Box)`
  width: 1500px;
  height: 800px;
  padding: 10px;
  border: 5px solid red;
`;
const StarFrame = keyframes`
  0% {
    transform: translateY(-700px);
  }
  80% {
    transform: translateY(30px);
  }
  90% {
    transform: translateY(-30px);
  }
  100% {
    transform: translateY(0px);
  }
`;
const AnimationStar = styled(Box)`
  &.star1 {
    animation: ${StarFrame} 1s cubic-bezier(0.19, -0.54, 0.73, 1.35) both;
  }
  &.star2 {
    animation: ${StarFrame} 1s cubic-bezier(0.19, -0.54, 0.73, 1.35) 0.2s both;
  }
  &.star3 {
    animation: ${StarFrame} 1s cubic-bezier(0.19, -0.54, 0.73, 1.35) 0.4s both;
  }
`;
const Drag = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const [targetDrag, setTargetDrag] = useImmer({
    isDown: false,
    coord: {
      x: 0,
      y: 0,
    },
  });

  const scrollPointerdown = useCallback(
    (e: { pageX: number; pageY: number }) => {
      setTargetDrag(p => {
        p.isDown = true;
        p.coord = { x: e.pageX, y: e.pageY };
      });
    },
    [setTargetDrag],
  );

  const scrollPointerup = useCallback(() => {
    setTargetDrag(p => {
      p.isDown = false;
      p.coord = { x: 0, y: 0 };
    });
  }, [setTargetDrag]);

  const scrollPointermove = useCallback(
    e => {
      e.preventDefault();
      const moveX = targetDrag.coord.x - e.pageX;
      const moveY = targetDrag.coord.y - e.pageY;
      setTargetDrag(p => {
        p.coord.x = e.pageX;
        p.coord.y = e.pageY;
      });
      if (targetDrag.isDown) {
        pageRef.current.scrollLeft += moveX;
        pageRef.current.scrollTop += moveY;
      }
    },
    [targetDrag, setTargetDrag],
  );

  useEffect(() => {
    const el = pageRef.current;
    if (el) {
      el.addEventListener('pointerdown', scrollPointerdown, false);
      document.addEventListener('pointerup', scrollPointerup, false);
      el.addEventListener('pointermove', scrollPointermove, false);
    }
    return () => {
      if (el) {
        el.removeEventListener('pointerdown', scrollPointerdown, false);
        document.removeEventListener('pointerup', scrollPointerup, false);
        el.removeEventListener('pointermove', scrollPointermove, false);
      }
    };
  }, [pageRef, scrollPointerdown, scrollPointerup, scrollPointermove]);

  return (
    <Flex width='100%' justifyContent='space-between'>
      <AnimationStar className='star1'>
        <Globe scale='ld' rotate={false} url='/images/star/32.jpg' />
      </AnimationStar>
      <AnimationStar className='star2'>
        <Globe scale='ld' rotate={false} url='/images/star/33.jpg' ml='20px' />
      </AnimationStar>
      <AnimationStar className='star3'>
        <Globe scale='ld' rotate={false} url='/images/star/35.jpg' ml='20px' />
      </AnimationStar>
      <ParentBox className={targetDrag.isDown ? 'no-select' : ''} ref={pageRef}>
        <ChilrdenBox>
          <Text>
            鼠标单击拖动区域，顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶
          </Text>
          <Button
            onClick={() => {
              console.log('惊喜！！！');
            }}
          >
            点击按钮有惊喜
          </Button>
        </ChilrdenBox>
      </ParentBox>
    </Flex>
  );
};

export default Drag;
