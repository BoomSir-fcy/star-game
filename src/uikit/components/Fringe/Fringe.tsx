import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Image } from '../Image';
import { Box, BoxProps } from '../Box';

const FringeStyled = styled(Image)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  margin: auto;
`;

const RATIO = 9.142857142857142;

interface FringeProps extends BoxProps {
  width?: number;
  height?: number;
}

const Fringe: React.FC<FringeProps> = ({
  width = 580,
  height,
  children,
  ...props
}) => {
  const { sWidth, sHeight } = useMemo(() => {
    return {
      sWidth: width,
      sHeight: height || width / RATIO,
    };
  }, [width, height]);
  return (
    <Box position='relative' width='100%' {...props}>
      <FringeStyled
        width={sWidth}
        height={sHeight}
        src='/images/commons/fringe.png'
      />
    </Box>
  );
};
export default Fringe;
