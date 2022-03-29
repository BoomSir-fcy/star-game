import React, { useEffect, useState } from 'react';
import { BoxProps } from 'uikit';
import { DigitalBack, DigitalFront, FlipBox } from './style';

interface FlipTimeProps extends BoxProps {
  front?: string;
  back?: string;
}
export const FlipTime: React.FC<FlipTimeProps> = ({
  front = '0',
  back = '0',
  ...props
}) => {
  const [state, setState] = useState({
    isFlipping: false,
    frontState: front,
    backState: back,
  });

  useEffect(() => {
    const flip = () => {
      if (front === back) return;
      setState({ frontState: front, backState: back, isFlipping: true });
      setTimeout(() => {
        setState({
          frontState: back,
          backState: back,
          isFlipping: false,
        });
      }, 600);
    };
    flip();
  }, [front, back]);

  return (
    <FlipBox {...props}>
      <DigitalFront
        className={`${state.isFlipping ? 'go' : ''} number-${state.frontState}`}
      />
      <DigitalBack
        className={`${state.isFlipping ? 'go' : ''} number-${state.backState}`}
      />
    </FlipBox>
  );
};
