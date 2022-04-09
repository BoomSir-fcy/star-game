import { createReducer, createSlice } from '@reduxjs/toolkit';
import { AppThunk, GameState } from 'state/types';
import { fetchGamePlanetUnits, fetchUnitList } from './fetchers';

export const initialState: GameState = {
  baseUnits: {},
  plantUnits: {},
  process: {},
};

export const fetchUnitListAsync =
  (race: Api.Game.race): AppThunk =>
  async dispatch => {
    const list = await fetchUnitList(race);
    dispatch(
      setUnits({
        [race]: list,
      }),
    );
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

    setPlantUnits: (state, { payload }) => {
      state.plantUnits = {
        ...state.plantUnits,
        [payload.id]: payload.list,
      };
    },
  },
});

// Actions
export const { setUnits, setPlantUnits } = userInfoSlice.actions;

export default userInfoSlice.reducer;
