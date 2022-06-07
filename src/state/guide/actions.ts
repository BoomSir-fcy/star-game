import { createAction } from '@reduxjs/toolkit';

export const toggleVisible = createAction<{
  visible: boolean;
  lastStep?: number;
  pathname?: string;
}>('guide/toggleVisible');

export default {
  toggleVisible,
};
