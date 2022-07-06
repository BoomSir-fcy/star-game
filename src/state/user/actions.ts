import { createAction } from '@reduxjs/toolkit';

export const toggleTheme = createAction<void>('user/toggleTheme');

export const setGlobalScale = createAction<number>('user/setGlobalScale');

export const setScreenMode = createAction<boolean>('user/setScreenMode');

export const setGlobalClient = createAction<{
  width?: number;
  height?: number;
}>('user/setGlobalClient');
