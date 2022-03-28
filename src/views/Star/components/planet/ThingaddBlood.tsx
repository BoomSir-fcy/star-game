import React from 'react';
import { Box, Image } from 'uikit';

export const ThingaddBlood = () => {
  return (
    <>
      <Box
        width='30px'
        height='30px'
        style={{
          cursor: 'pointer',
        }}
      >
        <Image
          src='/images/commons/icon/add_blood.png'
          width={30}
          height={30}
        />
      </Box>
    </>
  );
};
