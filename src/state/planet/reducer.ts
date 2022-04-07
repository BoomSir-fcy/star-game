import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PlanetState } from 'state/types';
import { setActiveMaterialMap, setActivePlanet } from './actions';

import { fetchMePlanetAsync, fetchPlanetInfoAsync } from './fetchers';

export const initialState: PlanetState = {
  mePlanet: [],
  planetInfo: {},
  activeMaterialMap: {},
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
      })
      .addCase(setActiveMaterialMap, (state, { payload }) => {
        const map = { ...state.activeMaterialMap, ...payload };
        // 删除value为null的key
        Object.keys(map).forEach(
          key => map[Number(key)] === null && delete map[Number(key)],
        );
        state.activeMaterialMap = map;
      });
  },
});

export default planet.reducer;