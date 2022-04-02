import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PlanetState } from 'state/types';
import { setActivePlanet } from './actions';

import { fetchMePlanetAsync, fetchPlanetInfoAsync } from './fetchers';

export const initialState: PlanetState = {
  mePlanet: [],
  planetInfo: {},
  activePlanet: {} as Api.Planet.PlanetInfo,
};

export const planet = createSlice({
  name: 'planet',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchMePlanetAsync.fulfilled, (state, action) => {
        state.mePlanet = action.payload;
      })
      .addCase(setActivePlanet, (state, { payload }) => {
        state.activePlanet = payload;
      })
      .addCase(fetchPlanetInfoAsync.fulfilled, (state, action) => {
        const mapObject: { [x: number]: Api.Planet.PlanetInfo } = {};
        action.payload?.map(item => {
          mapObject[item.id] = item;
          return mapObject;
        });
        state.planetInfo = mapObject;
      });
  },
});

export default planet.reducer;
