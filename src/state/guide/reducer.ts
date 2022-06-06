import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toggleVisible } from './actions';
import { GuideState } from '../types';

export const initialState: GuideState = {
  visible: false,
  lastStep: 0,
  pathname: '',
};

export const guide = createSlice({
  name: 'planet',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(toggleVisible, (state, { payload }) => {
      state.visible = payload.visible;
      state.lastStep = payload.lastStep || 0;
      state.pathname = payload.pathname || '';
    });
  },
});

export default guide.reducer;
