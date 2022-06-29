import { createAction } from '@reduxjs/toolkit';

export const destoryBuildingModal = createAction<{
  visible: boolean;
  destory: any;
}>('buildling/destoryBuilding');
export const upgradesBuildingModal = createAction<{
  visible: boolean;
  upgrad: any;
}>('buildling/upgradesBuilding');
export const queueVisbleSide = createAction<boolean>(
  'buildling/queueVisbleSide',
);
export const resetModal = createAction('buildling/resetModal');

const buildingAction = {
  destoryBuildingModal,
  upgradesBuildingModal,
  queueVisbleSide,
  resetModal,
};

export default buildingAction;
