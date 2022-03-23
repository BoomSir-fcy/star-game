import React from 'react';
import { Image, Box } from 'uikit';

const Flyer = () => {
  return (
    <>
      <Box
        height='100%'
        width='100%'
        position='absolute'
        top={0}
        left={0}
        zIndex={-1}
      >
        <Box
          position='absolute'
          width={800}
          height={800}
          top='0'
          left='0'
          right='0'
          bottom='0'
          margin='auto'
        >
          <Image width={800} height={800} src='/images/login/star.png' />
        </Box>
        <Box
          position='absolute'
          width={160}
          height={160}
          top='-80px'
          left='580px'
        >
          <Image width={160} height={160} src='/images/login/star.png' />
        </Box>
        <Box
          position='absolute'
          width={80}
          height={80}
          bottom='30px'
          left='520px'
        >
          <Image width={80} height={80} src='/images/login/star.png' />
        </Box>
        <Box
          position='absolute'
          width={406}
          height={225}
          top='80px'
          left='1350px'
        >
          <Image width={406} height={225} src='/images/login/flyer.png' />
        </Box>
      </Box>
    </>
  );
};

export default Flyer;
