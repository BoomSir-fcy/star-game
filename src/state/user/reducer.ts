import { createReducer } from '@reduxjs/toolkit';
import { updateVersion } from '../global/actions';
import { setGlobalClient, setGlobalScale, toggleTheme } from './actions';

const currentTimestamp = () => new Date().getTime();

export interface UserState {
  // the timestamp of the last updateVersion action
  lastUpdateVersionTimestamp?: number;

  isDark: boolean;

  scale: number; // 缩放比列

  client: {
    width: number;
    height: number;
  };
}

export const initialState: UserState = {
  isDark: false,
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

    .addCase(setGlobalClient, (state, { payload }) => {
      state.client = {
        ...state.client,
        ...payload,
      };
    }),
);
