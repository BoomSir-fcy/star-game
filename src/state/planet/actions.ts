import { createAction } from '@reduxjs/toolkit';
import { planetInfo } from 'state/types';

export const setActivePlanet = createAction<planetInfo>(
  'planet/setActivePlanet',
);
