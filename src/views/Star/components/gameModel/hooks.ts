import { Api } from 'apis';
import React from 'react';

export const useBuildingUpgrade = () => {
  const upgrade = React.useCallback(
    async (planet_id: number, building_id: number | string) => {
      try {
        const [info, detail] = await Promise.all([
          Api.BuildingApi.estimateBuildingUpgrade(planet_id, building_id),
          Api.BuildingApi.estimateBuildingUpgradeDetail(planet_id, building_id),
        ]);
        console.log(info, detail);
      } catch (error: any) {
        throw new Error(error);
      }
    },
    [],
  );

  return { upgrade };
};
