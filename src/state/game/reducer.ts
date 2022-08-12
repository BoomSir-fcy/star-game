import { createReducer, createSlice } from '@reduxjs/toolkit';
import { Api } from 'apis';
import { AppThunk, GamePkState, GameState } from 'state/types';
import {
  fetchGameMatchUser,
  fetchGamePK,
  fetchGamePKTest,
  fetchGamePlanetUnits,
  fetchGamePlanetUnitsTest,
  fetchGamePlunderPk,
  fetchGameterrain,
  fetchUnitList,
} from './fetchers';

export const initialState: GameState = {
  baseUnits: {},
  plantUnits: {},
  testPlantUnits: {},
  baseSkill: {},
  process: null,
  PKInfo: null,
  pkRes: false,
  plunderPK: {},
  state: GamePkState.MATCHING,
  matchUser: null,
  mineUser: null,
  TerrainInfo: [
    {
      map_id: 0,
      map_name: '',
      terrains: [],
    },
  ],
};

export const fetchUnitListAsync =
  (race: number, planet_id: number): AppThunk =>
  async dispatch => {
    const data = await fetchUnitList(race, planet_id);
    if (data) {
      dispatch(
        setUnits({
          [race]: data.units,
        }),
      );
      dispatch(setBaseSkill(data.base));
    }
  };

export const fetchTestUnitListAsync =
  (race: number): AppThunk =>
  async dispatch => {
    const data = await Api.GameApi.getAllUnitList(race);
    if (data) {
      dispatch(
        setUnits({
          [race]: data.data.units,
        }),
      );
      dispatch(setBaseSkill(data.data.base));
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
    dispatch(setPKInfo([PKInfo]));
  };

export const fetchGamePKTestAsync =
  (tag: string, maxRound?: number, terrain_id?: number): AppThunk =>
  async dispatch => {
    dispatch(setPKInfo(null));
    const PKInfo = await fetchGamePKTest(tag, maxRound, terrain_id);
    dispatch(setPKInfo([PKInfo]));
  };

export const fetchGameMatchUserAsync =
  (address?: string, our?: number): AppThunk =>
  async dispatch => {
    dispatch(setState(GamePkState.MATCHING));
    const res = await fetchGameMatchUser(address?.toLowerCase());
    if (Api.isSuccess(res) && res.data) {
      if (our === 1) {
        dispatch(setMineUser(res.data));
      } else {
        dispatch(setMatchUser(res.data));
      }
      dispatch(setState(GamePkState.MATCHED));
    } else {
      dispatch(setState(GamePkState.MATCH_ERROR));
    }
  };

export const fetchGamePlunderPkAsync = (): AppThunk => async dispatch => {
  const matchUser = await fetchGamePlunderPk();
  dispatch(setMatchUser(matchUser));
};

export const fetchGameterrainAsync = (): AppThunk => async dispatch => {
  const TerrainInfo = await fetchGameterrain();
  dispatch(setTerrainInfo(TerrainInfo));
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

    setPKRes: (state, { payload }) => {
      state.pkRes = payload;
    },

    setMatchUser: (state, { payload }) => {
      state.matchUser = payload;
    },

    setMineUser: (state, { payload }) => {
      state.mineUser = payload;
    },

    setPlunderPk: (state, { payload }) => {
      state.matchUser = payload;
    },

    setState: (state, { payload }: { payload: GamePkState }) => {
      state.state = payload;
    },

    setTerrainInfo: (state, { payload }) => {
      state.TerrainInfo = payload;
    },

    setEmptyUnits: (state, { payload }) => {
      state.plantUnits = {};
      state.baseUnits = {};
    },
  },
});

// Actions
export const {
  setUnits,
  setPlantUnits,
  setPKInfo,
  setBaseSkill,
  setMineUser,
  setMatchUser,
  setState,
  setPlantUnitsTest,
  setTerrainInfo,
  setPKRes,
  setEmptyUnits,
} = userInfoSlice.actions;

export default userInfoSlice.reducer;
