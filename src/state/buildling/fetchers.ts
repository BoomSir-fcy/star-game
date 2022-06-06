import { createAsyncThunk } from '@reduxjs/toolkit';
import { Api } from 'apis';

export const fetchBuildingsListAsync = createAsyncThunk(
  'fetch/buildings/list',
  async (params: { type: number; race: number }) => {
    const response = await Api.BuildingApi.getBuildingList(
      params.type,
      params.race,
    );
    if (Api.isSuccess(response)) {
      return response.data?.data;
    }
    return [];
  },
);

export const fetchPlanetBuildingsAsync = createAsyncThunk(
  'fetch/pleanet/biuldings',
  async (planet_id: number | string) => {
    // const response = await Api.BuildingApi.getPlanetBuildingList(planet_id);
    const [planet, assets] = await Promise.all([
      Api.BuildingApi.getPlanetBuildingList(planet_id),
      Api.BuildingApi.getStore(planet_id),
    ]);
    if (Api.isSuccess(planet)) {
      return { ...planet?.data, assets: assets?.data };
    }
    return { data: [], upgradeInfo: [], assets: {} };
  },
);
