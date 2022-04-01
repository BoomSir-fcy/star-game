import { Qualities, Races } from 'uikit/theme/types';

export interface Info extends Api.Planet.PlanetInfo {
  rarity: Qualities;
  race: Races;
}
