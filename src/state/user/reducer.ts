import { createReducer } from '@reduxjs/toolkit';
import { UserState } from '../types';
import { updateVersion } from '../global/actions';
import {
  setGlobalClient,
  setGlobalScale,
  setScreenMode,
  toggleTheme,
} from './actions';

const currentTimestamp = () => new Date().getTime();

export const initialState: UserState = {
  isDark: false,
  screenMode: false, // true为 为竖屏操作旋转屏幕
  scale: 1,
  client: {
    width: 1920,
    height: 900,
  },
};

export default createReducer(initialState, builder =>
  builder
    .addCase(updateVersion, state => {
      state.lastUpdateVersionTimestamp = currentTimestamp();
    })

    .addCase(toggleTheme, state => {
      state.isDark = !state.isDark;
    })

    .addCase(setGlobalScale, (state, { payload }) => {
      state.scale = payload;
    })

    .addCase(setScreenMode, (state, { payload }) => {
      state.screenMode = payload;
    })

    .addCase(setGlobalClient, (state, { payload }: { payload: any }) => {
      state.client = {
        ...state.client,
        ...payload,
      };
    }),
);
