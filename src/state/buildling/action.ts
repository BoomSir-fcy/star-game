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
export const setUpgradeUnsuccessful = createAction<boolean>(
  'buildling/setUpgradeUnsuccessful',
);
export const resetModal = createAction('buildling/resetModal');
export const resetSelfBuildings = createAction('buildling/resetSelfBuildings');

const buildingAction = {
  destoryBuildingModal,
  upgradesBuildingModal,
  queueVisbleSide,
  resetModal,
  resetSelfBuildings,
  setUpgradeUnsuccessful,
};

export default buildingAction;
