import React from 'react';
import { Box, BoxProps, Image } from 'uikit';

const StarGameBox: React.FC<BoxProps> = props => {
  return (
    <Box {...props} width={980}>
      <Image width={980} height={109} src='/images/login/star-game-box.png' />
    </Box>
  );
};

export default StarGameBox;
