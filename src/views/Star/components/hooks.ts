import React from 'react';
import { Api } from 'apis';

export const useBuffer = () => {
  const getPlanetBuff = React.useCallback(
    async (params: Api.Building.GetPlanetBuildingParams) => {
      try {
        const res = await Api.BuildingApi.getBuff(params);
        if (Api.isSuccess(res)) {
          return res?.data?.attack_buff;
        }
        return [];
      } catch (error: any) {
        throw new Error(error);
      }
    },
    [],
  );

  return {
    getPlanetBuff,
  };
};

export const useWorkqueue = () => {
  const refreshWorkQueue = React.useCallback(async (planet_id: number) => {
    try {
      const res = await Api.BuildingApi.refreshQueue(planet_id);
      return res;
    } catch (error: any) {
      throw new Error(error);
    }
  }, []);

  return {
    refreshWorkQueue,
  };
};
