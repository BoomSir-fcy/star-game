import { createAsyncThunk } from '@reduxjs/toolkit';
import { Api } from 'apis';

export const fetchBuildingsListAsync = createAsyncThunk(
  'fetch/buildings/list',
  async (type?: 1 | 2) => {
    const response = await Api.BuildingApi.getBuildingList(type);
    if (Api.isSuccess(response)) {
      return response.data?.data;
    }
    return [];
  },
);

export const fetchPlanetBuildingsAsync = createAsyncThunk(
  'fetch/pleanet/biuldings',
  async (planet_id: number | string) => {
    const response = await Api.BuildingApi.getPlanetBuildingList(planet_id);
    if (Api.isSuccess(response)) {
      return response.data;
    }
    return { data: [], upgradeInfo: [] };
  },
);
