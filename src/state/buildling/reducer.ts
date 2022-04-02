import { createSlice } from '@reduxjs/toolkit';
import { BuildlingState } from '../types';
import { fetchBuildingsListAsync, fetchPlanetBuildingsAsync } from './fetchers';

export const initialState: BuildlingState = {
  selfBuildings: [],
};

export const buildling = createSlice({
  name: 'buildling',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchBuildingsListAsync.fulfilled, (state, action) => {})
      .addCase(fetchPlanetBuildingsAsync.fulfilled, (state, action) => {
        const building = action.payload?.buildings?.map(
          (item: any) => item.building,
        );
        const leftArr: any = [];
        const rightArr: any = [];
        const map = (building ?? [])?.reduce((current: any, cur: any) => {
          // 根据type类型，添加到对应的数组中
          if (cur.type === 1) {
            leftArr.push(cur);
          } else {
            rightArr.push(cur);
          }
          return { ...current, 1: leftArr, 2: rightArr };
        }, {});
        state.selfBuildings = map;
      });
  },
});

export default buildling.reducer;
