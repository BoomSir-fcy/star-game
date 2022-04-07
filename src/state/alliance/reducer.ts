import { createSlice } from '@reduxjs/toolkit';
import { AllianceState, AppThunk, orderInfo } from 'state/types';
import { fetchMyPlanetAlliance } from './fetchers';

export const initialState: AllianceState = {
  allianceView: {
    alliance: {
      id: 0,
      uid: 0,
      beforeStoneCap: '',
      beforePopulationCap: '',
      beforeEnergyCap: '',
      createTime: 0,
      laterExtractTime: 0,
      power: 0,
      working: 0,
    },
    order: [],
    energy: {
      total_population: 0,
      total_stone: 0,
      total_energy: 0,
      per_population: 0,
      per_stone: 0,
      per_energy: 0,
    },
    end_time: 0,
    free_time: 0,
  },
  workingPlanet: [],
};

export const fetchAllianceViewAsync = (): AppThunk => async dispatch => {
  const info = await fetchMyPlanetAlliance();
  dispatch(setAllianceView(info));
};

export const allianceSlice = createSlice({
  name: 'alliance',
  initialState,
  reducers: {
    setAllianceView: (state, action) => {
      const { payload } = action;
      if (payload) {
        state.allianceView = {
          ...state.allianceView,
          ...payload,
        };
        console.log(payload);
        const planetList = payload.order || [];
        const workingPlanet = planetList.map((item: orderInfo) => {
          return item.planetId;
        });
        console.log(workingPlanet);
        state.workingPlanet = workingPlanet;
      }
    },
  },
});

// Actions
export const { setAllianceView } = allianceSlice.actions;

export default allianceSlice.reducer;