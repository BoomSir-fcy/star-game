import { qualities } from './types';

export const mysteryConfig = {
  [qualities.ORDINARY]: {
    label: 'Ordinary',
    tips: 'Common, Uncommon, or Rare Planet',
    srcName: 'ordinary',
    rarity: [1, 2, 3],
  },
  [qualities.ADVANCED]: {
    label: 'Advanced',
    tips: 'Uncommon, Rare, or Epic Planet',
    srcName: 'advanced',
    rarity: [2, 3, 4],
  },
  [qualities.SUPER]: {
    label: 'Super',
    tips: 'Epic, Legendary, or Mythic Planet',
    srcName: 'super',
    rarity: [4, 5, 6],
  },
};
