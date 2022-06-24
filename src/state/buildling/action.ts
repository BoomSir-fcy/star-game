import { createAction } from '@reduxjs/toolkit';

export const destoryBuildingVisibleModal = createAction<boolean>(
  'buildling/destoryBuilding',
);

export const queueVisbleSide = createAction<boolean>(
  'buildling/queueVisbleSide',
);

const buildingAction = {
  destoryBuildingVisibleModal,
  queueVisbleSide,
};

export default buildingAction;
