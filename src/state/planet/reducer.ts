import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { fetchMePlanetAsync } from './fetchers';

const initialState = {
  mePlanet: [],
};

export const planet = createSlice({
  name: 'planet',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchMePlanetAsync.fulfilled, (state, action) => {
      // state.mePlanet = action.payload.data;
    });
  },
});

export default planet.reducer;
