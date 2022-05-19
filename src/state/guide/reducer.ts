import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toggleVisible } from './actions';
import { GuideState } from '../types';

export const initialState: GuideState = {
  visible: false,
};

export const guide = createSlice({
  name: 'planet',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(toggleVisible, (state, { payload }) => {
      state.visible = payload.visible;
    });
  },
});

export default guide.reducer;
