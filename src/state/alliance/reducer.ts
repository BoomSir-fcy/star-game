import { createSlice } from '@reduxjs/toolkit';
import { AllianceState, AppThunk, orderInfo } from 'state/types';
import {
  fetchCombatRecord,
  fetchExploreProgress,
  fetchMyPlanetAlliance,
} from './fetchers';

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
    later_extract_time: 0,
    max_work_count: 0,
    now_work_count: 0,
    unread_plunder_count: 0,
    message_count: 0,
    hold_planet: false,
  },
  workingPlanet: [],
  pkRecord: {
    record: [],
    page: 1,
    page_size: 0,
    count: 0,
    win_count: 0,
    failed_count: 0,
    isEnd: false,
    loading: false,
  },
  DifficultyToExplore: 0,
  ExploreProgressDate: {
    end_time: 0,
    planet_detail: [],
    work_message: [],
    work_time: 0,
  },
};

export const fetchAllianceViewAsync = (): AppThunk => async dispatch => {
  const info = await fetchMyPlanetAlliance();
  dispatch(setAllianceView(info));
};

export const fetchExploreProgressAsync = (): AppThunk => async dispatch => {
  const info = await fetchExploreProgress();
  dispatch(setExploreProgressDate(info));
};

export const fetchCombatRecordAsync =
  (address: string, start_time: number, end_time: number): AppThunk =>
  async dispatch => {
    const info = await fetchCombatRecord(address, start_time, end_time);
    dispatch(setPkRecord(info));
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
        const planetList = payload.order || [];
        const workingPlanet = planetList.map((item: orderInfo) => {
          return item.planetId;
        });
        state.workingPlanet = workingPlanet;
      }
    },
    setPkRecord: (state, action) => {
      const { payload } = action;
      const { pkRecord } = state;
      if (payload) {
        const temp = payload.record;
        // const nowList =
        //   payload.page === 1 ? temp : [...pkRecord.record, ...temp];
        const nowList = temp;
        const isEnd = false;
        // if (payload.page * payload.page_size >= payload.count) {
        //   isEnd = true;
        // }
        state.pkRecord = {
          ...payload,
          record: nowList,
          isEnd,
          loading: false,
        };
      }
    },
    setRecordLoad: state => {
      state.pkRecord.loading = true;
    },
    setDifficultyToExplore: (state, action) => {
      state.DifficultyToExplore = action.payload;
    },
    setExploreProgressDate: (state, action) => {
      if (action.payload) {
        state.ExploreProgressDate = action.payload;
      }
    },
  },
});

// Actions
export const {
  setAllianceView,
  setPkRecord,
  setRecordLoad,
  setDifficultyToExplore,
  setExploreProgressDate,
} = allianceSlice.actions;

export default allianceSlice.reducer;
