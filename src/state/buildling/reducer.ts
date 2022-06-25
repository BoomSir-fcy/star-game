import { createSlice } from '@reduxjs/toolkit';
import { BuildlingState } from '../types';
import { fetchBuildingsListAsync, fetchPlanetBuildingsAsync } from './fetchers';
import {
  destoryBuildingModal,
  upgradesBuildingModal,
  queueVisbleSide,
} from './action';

export const initialState: BuildlingState = {
  buildings: [], // 所有基础建筑
  upgradeIds: [],
  selfBuildings: {
    building_type: 0,
    buildings: [],
    id: '',
    planet_id: 0,
  },
  destroyBuilding: {
    visible: false,
    destory: {} as any,
  },
  upgradesBuilding: {
    visible: false,
    upgrad: {} as any,
  },
  planetAssets: {
    energy: 0,
    population: 0,
    stone: 0,
  },
  queue: {
    visible: false,
  },
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
          if (next?.propterty?.levelEnergy === 1) {
            current[key]?.push(next);
          }
          return current;
        }, {});
        state.buildings = map;
      })
      .addCase(fetchPlanetBuildingsAsync.fulfilled, (state, action) => {
        const { data, upgradeInfo, assets } = action.payload;
        const self = data?.buildings?.reduce((current: any, row: any) => {
          const target = upgradeInfo?.find(
            (item: any) => item.building_id === row.building?._id,
          );
          if (target?.building_id) {
            current.push({
              ...row,
              status: target,
            });
          } else {
            current.push(row);
          }
          return current;
        }, []);
        data.buildings = self;
        state.selfBuildings = data;
        state.planetAssets = assets;
      })
      .addCase(destoryBuildingModal, (state, action) => {
        state.destroyBuilding = action.payload;
      })
      .addCase(upgradesBuildingModal, (state, action) => {
        state.upgradesBuilding = action.payload;
      })
      .addCase(queueVisbleSide, (state, action) => {
        state.queue.visible = action.payload;
      });
  },
});

export default buildling.reducer;
