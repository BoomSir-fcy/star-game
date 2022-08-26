import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  toggleVisible,
  toggleRechargeVisible,
  setErrCode,
  setToRechargeVisible,
  setRechargeOperationType,
  setBuyPrice,
  setTokenToFrom,
} from './actions';
import { GuideState } from '../types';

export const initialState: GuideState = {
  visible: false,
  lastStep: 0,
  pathname: '',
  buyPrice: '',
  recharge_visible: false,
  toRechargeVisible: false,
  RechargeOperationType: 1,
  errorCode: localStorage.getItem('errCode') || '0',
  tokenToFrom: {
    to: '',
    from: '',
    token: [],
    toPosition: '',
  },
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
        if (!payload.visible) {
          state.buyPrice = '';
        }
        state.toRechargeVisible = payload.visible;
      })
      .addCase(setBuyPrice, (state, { payload }) => {
        state.buyPrice = payload.price;
      })
      .addCase(setRechargeOperationType, (state, { payload }) => {
        state.RechargeOperationType = payload.OperationType;
      })
      .addCase(setTokenToFrom, (state, { payload }) => {
        state.tokenToFrom = {
          to: payload.to,
          from: payload.from,
          token: payload.token,
          toPosition: payload.toPosition,
        };
      });
  },
});

export default guide.reducer;
