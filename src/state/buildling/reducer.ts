import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { fetchBuildingsListAsync } from './fetchers';

export const initialState = {
  buildingsList: [] as any,
};

export const planet = createSlice({
  name: 'Buildling',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchBuildingsListAsync.fulfilled, (state, action) => {
      state.buildingsList = action.payload;
    });
  },
});

export default planet.reducer;
