import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PlanetState } from 'state/types';

import { fetchMePlanetAsync, fetchPlanetInfoAsync } from './fetchers';

export const initialState: PlanetState = {
  mePlanet: [],
  planetInfo: [],
};

export const planet = createSlice({
  name: 'planet',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchMePlanetAsync.fulfilled, (state, action) => {
      state.mePlanet = action.payload;
    });
    builder.addCase(fetchPlanetInfoAsync.fulfilled, (state, action) => {
      state.planetInfo = action.payload;
    });
  },
});

export default planet.reducer;
