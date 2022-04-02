import { createSlice } from '@reduxjs/toolkit';
import { BuildlingState } from '../types';
import { fetchBuildingsListAsync, fetchPlanetBuildingsAsync } from './fetchers';

export const initialState: BuildlingState = {
  buildings: [], // 所有基础建筑
  selfBuildings: [],
};

export const buildling = createSlice({
  name: 'buildling',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchBuildingsListAsync.fulfilled, (state, action) => {
        const map = (action.payload ?? []).reduce((current: any, next: any) => {
          const key = next?.type;
          if (!current[key]) {
            // eslint-disable-next-line no-param-reassign
            current[key] = [];
          }
          current[key]?.push(next);
          return current;
        }, {});
        state.buildings = map;
      })
      .addCase(fetchPlanetBuildingsAsync.fulfilled, (state, action) => {
        // console.log(action.payload);
      });
  },
});

export default buildling.reducer;
