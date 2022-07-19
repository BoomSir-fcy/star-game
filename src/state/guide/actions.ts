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

export default {
  toggleVisible,
  toggleRechargeVisible,
  setErrCode,
  setToRechargeVisible,
  setRechargeOperationType,
};
