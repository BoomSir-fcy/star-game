import React from 'react';
import { Box, Image } from 'uikit';
import { ThingRepairModal } from '../Modal';

export const ThingRepair = () => {
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
        <Image src='/images/commons/icon/repair.png' width={30} height={30} />
      </Box>

      <ThingRepairModal
        visible={state.visible}
        onClose={() => setState({ ...state, visible: false })}
      />
    </>
  );
};
