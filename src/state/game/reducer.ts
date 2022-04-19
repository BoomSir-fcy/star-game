import { createReducer, createSlice } from '@reduxjs/toolkit';
import { AppThunk, GameState } from 'state/types';
import {
  fetchGamePK,
  fetchGamePKTest,
  fetchGamePlanetUnits,
  fetchGamePlanetUnitsTest,
  fetchUnitList,
} from './fetchers';

export const initialState: GameState = {
  baseUnits: {},
  plantUnits: {},
  testPlantUnits: {},
  baseSkill: {},
  process: null,
  PKInfo: null,
};

export const fetchUnitListAsync =
  (race: number): AppThunk =>
  async dispatch => {
    const data = await fetchUnitList(race);
    if (data) {
      dispatch(
        setUnits({
          [race]: data.units,
        }),
      );
      dispatch(setBaseSkill(data.base));
    }
  };

export const fetchGamePlanetUnitsAsync =
  (id: number): AppThunk =>
  async dispatch => {
    const list = await fetchGamePlanetUnits(id);
    dispatch(
      setPlantUnits({
        id,
        list,
      }),
    );
  };

export const fetchGamePlanetUnitsTestAsync =
  (id: number): AppThunk =>
  async dispatch => {
    const { units1, units2, tag } =
      (await fetchGamePlanetUnitsTest(`t-${id}`)) || {};
    if (tag) {
      dispatch(
        setPlantUnitsTest({
          id: tag,
          units1,
          units2,
        }),
      );
    }
  };

export const fetchGamePKAsync =
  (id1: number, id2: number, maxRound?: number): AppThunk =>
  async dispatch => {
    const PKInfo = await fetchGamePK(id1, id2, maxRound);
    dispatch(setPKInfo(PKInfo));
  };

export const fetchGamePKTestAsync =
  (tag: string, maxRound?: number): AppThunk =>
  async dispatch => {
    const PKInfo = await fetchGamePKTest(tag, maxRound);
    dispatch(setPKInfo(PKInfo));
  };

export const userInfoSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setUnits: (state, action) => {
      const { payload } = action;
      state.baseUnits = {
        ...state.baseUnits,
        ...payload,
      };
    },
    setBaseSkill: (state, action) => {
      const { payload } = action;
      state.baseSkill = {
        ...state.baseSkill,
        ...payload,
      };
    },

    setPlantUnits: (state, { payload }) => {
      state.plantUnits = {
        ...state.plantUnits,
        [payload.id]: payload.list,
      };
    },

    setPlantUnitsTest: (state, { payload }) => {
      state.testPlantUnits = {
        ...state.testPlantUnits,
        [payload.id]: payload,
      };
    },

    setPKInfo: (state, { payload }) => {
      state.PKInfo = payload;
    },
  },
});

// Actions
export const {
  setUnits,
  setPlantUnits,
  setPKInfo,
  setBaseSkill,
  setPlantUnitsTest,
} = userInfoSlice.actions;

export default userInfoSlice.reducer;
