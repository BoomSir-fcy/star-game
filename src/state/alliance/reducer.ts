import { createSlice } from '@reduxjs/toolkit';
import { AllianceState, AppThunk, orderInfo } from 'state/types';
import { fetchCombatRecord, fetchMyPlanetAlliance } from './fetchers';

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
};

export const fetchAllianceViewAsync = (): AppThunk => async dispatch => {
  const info = await fetchMyPlanetAlliance();
  dispatch(setAllianceView(info));
};

export const fetchCombatRecordAsync =
  (address: string, page: number, page_size: number): AppThunk =>
  async dispatch => {
    const info = await fetchCombatRecord(address, page, page_size);
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
        const nowList =
          payload.page === 1 ? temp : [...pkRecord.record, ...temp];

        let isEnd = false;
        if (payload.page * payload.page_size >= payload.count) {
          isEnd = true;
        }
        state.pkRecord = {
          ...payload,
          record: nowList,
          isEnd,
          loading: false,
        };
      }
    },
    setRefresh: state => {
      state.pkRecord.record = [];
    },
    setRecordLoad: state => {
      state.pkRecord.loading = true;
    },
  },
});

// Actions
export const { setAllianceView, setPkRecord, setRefresh, setRecordLoad } =
  allianceSlice.actions;

export default allianceSlice.reducer;
