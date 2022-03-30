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
