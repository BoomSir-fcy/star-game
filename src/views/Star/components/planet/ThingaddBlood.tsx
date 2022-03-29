import React from 'react';
import { Box, Image } from 'uikit';

import { ThingHpModal } from '../Modal';

export const ThingaddBlood = () => {
  const [state, setState] = React.useState({
    visible: false,
  });

  return (
    <>
      <Box
        width='30px'
        height='30px'
        style={{
          cursor: 'pointer',
        }}
        onClick={() => setState({ ...state, visible: true })}
      >
        <Image
          src='/images/commons/icon/add_blood.png'
          width={30}
          height={30}
        />
      </Box>

      <ThingHpModal
        visible={state.visible}
        onClose={() => setState({ ...state, visible: false })}
      />
    </>
  );
};
