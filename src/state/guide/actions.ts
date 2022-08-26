import { createAction } from '@reduxjs/toolkit';

export const toggleVisible = createAction<{
  visible: boolean;
  lastStep?: number;
  pathname?: string;
}>('guide/toggleVisible');

export const toggleRechargeVisible = createAction<{
  visible: boolean;
}>('guide/toggleRechargeVisible');

export const setToRechargeVisible = createAction<{
  visible: boolean;
}>('guide/setToRechargeVisible');

export const setErrCode = createAction<{
  code: string;
}>('guide/setErrCode');

export const setRechargeOperationType = createAction<{
  OperationType: number;
}>('guide/setRechargeOperationType');

export const setBuyPrice = createAction<{
  price: string;
}>('guide/setBuyPrice');

export const setTokenToFrom = createAction<{
  to: string;
  from: string;
  token: string[];
  toPosition: string;
}>('guide/setTokenToFrom');

export default {
  toggleVisible,
  setBuyPrice,
  toggleRechargeVisible,
  setErrCode,
  setToRechargeVisible,
  setRechargeOperationType,
  setTokenToFrom,
};
