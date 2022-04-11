import { createAction } from '@reduxjs/toolkit';

export const destoryBuildingVisibleModal = createAction<boolean>(
  'buildling/destoryBuilding',
);

const buildingAction = {
  destoryBuildingVisibleModal,
};

export default buildingAction;
