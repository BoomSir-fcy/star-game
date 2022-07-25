import { createAsyncThunk } from '@reduxjs/toolkit';
import { Api } from 'apis';

// export const fetchMePlanetAsync = createAsyncThunk(
//   'fetch/getMePlanet',
//   async (params: Api.Planet.PageParams) => {
//     const response = await Api.PlanetApi.getMePlanet(params);
//     if (Api.isSuccess(response)) {
//       return response.data.Data || [];
//     }
//     return [];
//   },
// );

export const fetchPlanetList = async (params: Api.Planet.PageParams) => {
  try {
    const res = await Api.PlanetApi.getMePlanet(params);
    if (Api.isSuccess(res)) {
      return res.data.Data || [];
    }
    return [];
  } catch (error) {
    console.error(`fetch fetchGalaxyList error: ${error}`);
    return [];
  }
};

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

// export const fetchMyPlanetAsync = createAsyncThunk(
//   'fetch/getMePlanet',
//   async (params: Api.Planet.Strengthen) => {
//     const response = await Api.PlanetApi.getPlanetStrengthen(params);
//     return response;
//   },
// );
