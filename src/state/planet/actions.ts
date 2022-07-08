import { createAction } from '@reduxjs/toolkit';

export const setActivePlanet = createAction<Api.Planet.PlanetInfo>(
  'planet/setActivePlanet',
);

export const setActiveMaterialMap = createAction<{
  [x: number]: Api.Planet.PlanetInfo | null;
} | null>('planet/setActiveMaterialMap');

export const setUpgradePlanetId = createAction<number | null>(
  'planet/setUpgradePlanetId',
);
export const setActiveNavId = createAction<string>('planet/setActiveNavId');
export const setAssetsVisible = createAction<boolean>(
  'planet/setAssetsVisible',
);
