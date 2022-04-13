import { RaceType } from 'uikit/theme/types';

export const raceBase = {
  [RaceType.PROTOSS]: {
    label: 'race-1',
    ethnicity:
      'Cosmic beings belong to the mysterious high-level creatures of the galaxy. They have the highest racial civilization, and their highly advanced technology and spiritual abilities give them absolute strength in space. The Cosmos has an AOE damage structure, and its comprehensive combat power is more balanced than the other two groups.',
    features: 'Shield, Restoration, AOE',
  },
  [RaceType.HUMAN]: {
    label: 'race-2',
    ethnicity:
      'Interstellar guards composed of the United Legion, wandering in various galaxies. Absolute mechanical capabilities and high-tech technology provide absolute combat protection, and have long-range tactical capabilities, which have a resistance to the Zerg. Production efficiency and building HP are relatively low due to wandering.',
    features: 'Defensive, Medical, Remote',
  },
  [RaceType.ZERG]: {
    label: 'race-3',
    ethnicity:
      'A brutal race evolved from interstellar creatures, with extremely high damage, natural weapons and armor are comparable to other races, and their dedication makes the Zerg extremely strong and deadly. But no AOE and close range attack are their weak points.',
    features: 'Speed,High burst',
  },
};
