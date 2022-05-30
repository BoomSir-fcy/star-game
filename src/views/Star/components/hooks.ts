import { Api } from 'apis';
import React from 'react';

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
