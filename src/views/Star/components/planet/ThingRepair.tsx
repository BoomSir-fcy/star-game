import React from 'react';
import { Box, Image } from 'uikit';
import { Api } from 'apis';
import { ThingRepairModal } from '../Modal';

import { useBuildingRepair } from '../gameModel/hooks';

export const ThingRepair: React.FC<{
  itemData: any;
  planet_id: number;
  building_id?: string | number;
  onCallback?: (time?: number) => void;
}> = ({ itemData, planet_id, building_id, onCallback }) => {
  const { setRepair, setBatchRepair } = useBuildingRepair();
  const [state, setState] = React.useState({
    visible: false,
  });

  // 修复耐久
  const repair = async () => {
    try {
      const res = await setRepair({ planet_id, building_id });
      if (Api.isSuccess(res)) {
        onCallback(res.data?.end_time);
        setState({ ...state, visible: false });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Box
        width='30px'
        height='30px'
        style={{
          cursor: 'pointer',
        }}
        onClick={event => {
          // event.preventDefault();
          // event.stopPropagation();
          setState({ ...state, visible: true });
        }}
      >
        <Image src='/images/commons/icon/repair.png' width={30} height={30} />
      </Box>

      {state.visible && (
        <ThingRepairModal
          itemData={itemData}
          planet_id={planet_id}
          building_id={building_id}
          visible={state.visible}
          onChange={repair}
          onClose={() => setState({ ...state, visible: false })}
        />
      )}
    </>
  );
};
