import React from 'react';
import { Box, BoxProps, Image } from 'uikit';

const StarGameBox: React.FC<BoxProps> = props => {
  return (
    <Box {...props} width={780}>
      <Image width={780} height={80} src='/images/login/star-game-box.png' />
    </Box>
  );
};

export default StarGameBox;
