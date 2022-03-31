import { createAsyncThunk } from '@reduxjs/toolkit';
import { Api } from 'apis';

// Async thunks
export const fetchMePlanetAsync = createAsyncThunk(
  'fetch/getMePlanet',
  async (params: Api.Planet.PageParams) => {
    const response = await Api.PlanetApi.getMePlanet(params);
    return response;
  },
);

export const fetchPlanetInfoAsync = createAsyncThunk(
  'fetch/getPlanetInfo',
  async (ids: number[] | string[]) => {
    const response = await Api.PlanetApi.getPlanetInfo(ids);
    if (Api.isSuccess(response)) {
      return response.data.Data;
    }
    return [];
  },
);
