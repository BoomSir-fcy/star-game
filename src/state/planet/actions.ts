import { createAction } from '@reduxjs/toolkit';

export const setActivePlanet = createAction<Api.Planet.PlanetInfo>(
  'planet/setActivePlanet',
);
