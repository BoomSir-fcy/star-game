import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  toggleVisible,
  toggleRechargeVisible,
  setErrCode,
  setToRechargeVisible,
  setRechargeOperationType,
} from './actions';
import { GuideState } from '../types';

export const initialState: GuideState = {
  visible: false,
  lastStep: 0,
  pathname: '',
  recharge_visible: false,
  toRechargeVisible: false,
  RechargeOperationType: 1,
  errorCode: localStorage.getItem('errCode') || '0',
};

export const guide = createSlice({
  name: 'planet',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(toggleVisible, (state, { payload }) => {
        state.visible = payload.visible;
        state.lastStep = payload.lastStep || 0;
        state.pathname = payload.pathname || '';
      })
      .addCase(toggleRechargeVisible, (state, { payload }) => {
        state.recharge_visible = payload.visible;
      })
      .addCase(setErrCode, (state, { payload }) => {
        state.errorCode = payload.code;
      })
      .addCase(setToRechargeVisible, (state, { payload }) => {
        state.toRechargeVisible = payload.visible;
      })
      .addCase(setRechargeOperationType, (state, { payload }) => {
        state.RechargeOperationType = payload.OperationType;
      });
  },
});

export default guide.reducer;
