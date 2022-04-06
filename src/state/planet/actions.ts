import { createAction } from '@reduxjs/toolkit';

export const setActivePlanet = createAction<Api.Planet.PlanetInfo>(
  'planet/setActivePlanet',
);

export const setActiveMaterialMap = createAction<{
  [x: number]: Api.Planet.PlanetInfo | null;
}>('planet/setActiveMaterialMap');
