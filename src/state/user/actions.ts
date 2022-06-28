import { createAction } from '@reduxjs/toolkit';

export const toggleTheme = createAction<void>('user/toggleTheme');

export const setGlobalScale = createAction<number>('user/setGlobalScale');

export const setNavZIndex = createAction<boolean>('user/setNavZIndex');

export const setGlobalClient = createAction<{
  width?: number;
  height?: number;
}>('user/setGlobalClient');
