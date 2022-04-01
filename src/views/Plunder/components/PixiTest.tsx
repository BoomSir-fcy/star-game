/* eslint-disable no-param-reassign */

import React, { useEffect, useReducer, useRef } from 'react';
import { Stage, Sprite, Container, useTick } from '@inlet/react-pixi';
import { Box } from 'uikit';
import openBox from 'utils/openBox';

const Bunny = () => {
  const reducer = (_: any, { data }: any) => data;

  const [motion, update] = useReducer(reducer, []);
  const iter = useRef(0);

  useTick(delta => {
    const i = 0.05 * delta + iter.current;
    iter.current = i;

    update({
      type: 'update',
      data: {
        x: Math.sin(i) * 100,
        y: Math.sin(i / 1.5) * 100,
        // rotation: Math.sin(i) * Math.PI,
        // anchor: Math.sin(i / 2),
      },
    });
  });

  return (
    <Sprite
      rotation={1}
      image='/images/commons/icon/union.png'
      x={100}
      y={100}
      {...motion}
    />
  );
};

const PixiTest = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      // openBox
      ref.current.appendChild(openBox.view);
    }
  }, [ref]);
  return (
    <Box ref={ref} width={500} height={500} background='#000'>
      {/* <Container x={150} y={150}>
        <Bunny />
      </Container>
      <Bunny /> */}
    </Box>
  );
};

export default PixiTest;
