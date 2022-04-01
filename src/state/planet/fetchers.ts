import { createAsyncThunk } from '@reduxjs/toolkit';
import { Api } from 'apis';

// 我的星球列表
export const fetchMePlanetAsync = createAsyncThunk(
  'fetch/getMePlanet',
  async (params: Api.Planet.PageParams) => {
    const response = await Api.PlanetApi.getMePlanet(params);
    return response;
  },
);

// export const fetchMyPlanetAsync = createAsyncThunk(
//   'fetch/getMePlanet',
//   async (params: Api.Planet.Strengthen) => {
//     const response = await Api.PlanetApi.getPlanetStrengthen(params);
//     return response;
//   },
// );
