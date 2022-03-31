import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { planetState } from 'state/types';

import { fetchMePlanetAsync } from './fetchers';

export const initialState: planetState = {
  mePlanet: [],
};

export const planet = createSlice({
  name: 'planet',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchMePlanetAsync.fulfilled, (state, action) => {
      state.mePlanet = action.payload.data.Data;
    });
  },
});

export default planet.reducer;
