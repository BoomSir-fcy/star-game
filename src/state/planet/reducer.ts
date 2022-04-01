import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { planetState } from 'state/types';
import { setActivePlanet } from './actions';

import { fetchMePlanetAsync } from './fetchers';

export const initialState: planetState = {
  mePlanet: [],
  activePlanet: {
    addTime: 0,
    areaX: 0,
    areaY: 0,
    energyConsumption: 0,
    energyYield: 0,
    id: 0,
    is_available: false,
    level: 1,
    name: '',
    oldOwner: '',
    oreConsumption: 0,
    oreYield: 0,
    owner: '',
    populationConsumption: 0,
    populationYield: 0,
    rarity: 1,
    settleAt: 0,
    strengthenLevel: 0,
    strengthen_finish_time: 0,
    update_finish_time: 0,
    workTime: 0,
    working: false,
    build_count: 0,
    energy: 0,
    attack: 0,
    build: 0,
    defense: 0,
    hp: 0,
    product: 0,
    plunder_speed: 0,
    population: 0,
    race: 0,
    stone: 0,
  },
};

export const planet = createSlice({
  name: 'planet',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchMePlanetAsync.fulfilled, (state, action) => {
        state.mePlanet = action.payload.data.Data;
      })
      .addCase(setActivePlanet, (state, { payload }) => {
        state.activePlanet = payload;
      });
    // .addCase(fetchMyPlanetAsync.fulfilled, (state, action) => {
    //   // state.mePlanet = action.payload.data.Data;
    // })
  },
});

export default planet.reducer;
