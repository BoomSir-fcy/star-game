import React from 'react';
import { Api } from 'apis';

export const useBuildingUpgrade = () => {
  const upgrade = React.useCallback(
    async (planet_id: number, building_id: number | string) => {
      try {
        const [info, detail] = await Promise.all([
          Api.BuildingApi.estimateBuildingUpgrade(planet_id, building_id),
          Api.BuildingApi.estimateBuildingUpgradeDetail(planet_id, building_id),
        ]);
        if (Api.isSuccess(info) && Api.isSuccess(detail)) {
          return {
            ...info.data,
            ...detail.data,
          };
        }
        return {};
      } catch (error: any) {
        throw new Error(error);
      }
    },
    [],
  );

  return { upgrade };
};

// 建筑物耐久
export const useBuildingRepair = () => {
  const getCose = React.useCallback(
    async (params: Api.Building.BuildingsOperateParams) => {
      try {
        const res = await Api.BuildingApi.getRepairBuilding(params);
        return res;
      } catch (error: any) {
        throw new Error(error);
      }
    },
    [],
  );

  // 修复耐久
  const setRepair = React.useCallback(
    async (params: Api.Building.BuildingsOperateParams) => {
      try {
        const res = await Api.BuildingApi.setRepairBuilding(params);
        return res;
      } catch (error: any) {
        throw new Error(error);
      }
    },
    [],
  );

  // 加速恢复耐久
  const setRepairQuick = React.useCallback(
    async (params: Api.Building.BuildingsOperateParams) => {
      try {
        const res = await Api.BuildingApi.quickRepairBuilding(params);
        return res;
      } catch (error: any) {
        throw new Error(error);
      }
    },
    [],
  );

  // 升级完成
  const upgradeRepairComplete = React.useCallback(
    async (params: Api.Building.BuildingsOperateParams) => {
      try {
        const res = await Api.BuildingApi.updateRepairBuilding(params);
        return res;
      } catch (error: any) {
        throw new Error(error);
      }
    },
    [],
  );

  return { getCose, setRepair, setRepairQuick, upgradeRepairComplete };
};

// 操作建筑物
export const useBuildingOperate = () => {
  const upgrade = React.useCallback(
    async (params: Api.Building.BuildingsOperateParams) => {
      try {
        const res = await Api.BuildingApi.upgradeBuilding(params);
        return res;
      } catch (error: any) {
        throw new Error(error);
      }
    },
    [],
  );

  // 快速升级
  const setBuildingQuick = React.useCallback(
    async (params: Api.Building.BuildingsOperateParams) => {
      try {
        const res = await Api.BuildingApi.accelerateBuildingUpgrade(params);
        return res;
      } catch (error: any) {
        throw new Error(error);
      }
    },
    [],
  );

  // 升级完成
  const upgradBuildingComplete = React.useCallback(
    async (params: Api.Building.BuildingsOperateParams) => {
      try {
        const res = await Api.BuildingApi.finishBuildingUpgrade(params);
        return res;
      } catch (error: any) {
        throw new Error(error);
      }
    },
    [],
  );

  const destory = React.useCallback(
    async (params: {
      planet_id: number;
      build_type: number | string;
      building_setting: any[];
    }) => {
      try {
        const res = await Api.BuildingApi.destroyBuilding(params);
        return res;
      } catch (error: any) {
        throw new Error(error);
      }
    },
    [],
  );

  return { upgrade, setBuildingQuick, upgradBuildingComplete, destory };
};

export const useBuildingOperateAll = () => {
  // 一键修复
  const repairAll = React.useCallback(() => {}, []);

  return {
    repairAll,
  };
};
