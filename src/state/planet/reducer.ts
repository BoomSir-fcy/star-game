import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AppThunk, PlanetState } from 'state/types';
import {
  setActiveMaterialMap,
  setActiveNavId,
  setActivePlanet,
  setUpgradePlanetId,
  setAssetsVisible,
} from './actions';

import { fetchPlanetInfoAsync, fetchPlanetList } from './fetchers';

export const initialState: PlanetState = {
  mePlanet: [],
  mePlanetLoading: true,
  assetsVisibleModal: true,
  planetInfo: {},
  activeMaterialMap: {},
  upgradePlanetId: null,
  activeNavId: 'build',
  activePlanet: {} as Api.Planet.PlanetInfo,
};

// 我的星球列表
export const fetchMePlanetAsync =
  (params: Api.Planet.PageParams): AppThunk =>
  async dispatch => {
    dispatch(setPlanetLoading(true));
    const list = await fetchPlanetList(params);
    dispatch(setPlanetList(list));
  };

export const planet = createSlice({
  name: 'planet',
  initialState,
  reducers: {
    setPlanetLoading: (state, action) => {
      state.mePlanetLoading = action.payload;
    },
    setPlanetList: (state, action) => {
      const { payload } = action;
      if (payload) {
        state.mePlanet = payload;
        state.mePlanetLoading = false;
      }
    },
  },
  extraReducers: builder => {
    builder
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
        if (payload === null) {
          state.activeMaterialMap = {};
        } else {
          const map = { ...state.activeMaterialMap, ...payload };
          // 删除value为null的key
          Object.keys(map).forEach(
            key => map[Number(key)] === null && delete map[Number(key)],
          );
          state.activeMaterialMap = map;
        }
      })
      .addCase(setUpgradePlanetId, (state, { payload }) => {
        state.upgradePlanetId = payload;
      })
      .addCase(setAssetsVisible, (state, { payload }) => {
        state.assetsVisibleModal = payload;
      })
      .addCase(setActiveNavId, (state, { payload }) => {
        state.activeNavId = payload;
      });
  },
});

// Actions
export const { setPlanetList, setPlanetLoading } = planet.actions;

export default planet.reducer;
