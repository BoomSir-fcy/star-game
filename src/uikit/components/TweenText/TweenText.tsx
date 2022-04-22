import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { Tween, PlayState } from 'react-gsap';
import { Text, TextProps } from '../Text';

gsap.registerPlugin(TextPlugin);

console.log('12222222222222gsap');

interface TweenTextProps extends TextProps {
  to: string;
  from?: string;
  duration?: number;
}

const TweenText: React.FC<TweenTextProps> = ({
  from = '',
  to,
  duration = 2,
  ...props
}) => {
  return (
    <Text {...props}>
      <Tween playState={PlayState.play} to={{ text: to }} duration={duration}>
        <span>{from}</span>
      </Tween>
    </Text>
  );
};

export default TweenText;
