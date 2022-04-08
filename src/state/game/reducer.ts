import { createReducer, createSlice } from '@reduxjs/toolkit';
import { AppThunk, GameState } from 'state/types';
import {
  fetchGamePlanetUnits,
  fetchUnitList,
} from './fetchers';


export const initialState: GameState = {
  baseUnits: {},
  plantUnits: {},
};

export const fetchUnitListAsync =
  (race: Api.Game.race): AppThunk =>
  async dispatch => {
    const list = await fetchUnitList(race);
    dispatch(setUnits({
      [race]: list,
    }));
  };

export const fetchGamePlanetUnitsAsync =
  (id: number): AppThunk =>
  async dispatch => {
    const list = await fetchGamePlanetUnits(id);
    
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
      }
    },

  },
});

// Actions
export const {
  setUnits,
} = userInfoSlice.actions;

export default userInfoSlice.reducer;
