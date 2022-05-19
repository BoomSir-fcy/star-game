import { createAction } from '@reduxjs/toolkit';

export const toggleVisible = createAction<{ visible: boolean }>(
  'guide/toggleVisible',
);

export default {
  toggleVisible,
};
