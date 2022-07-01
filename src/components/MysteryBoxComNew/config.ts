import { qualities } from './types';

export const mysteryConfig = {
  [qualities.ORDINARY]: {
    label: 'Ordinary',
    tips: 'Common, Uncommon, Rare, Epic',
    srcName: 'ordinary',
    rarity: [1, 2, 3, 4],
  },
  [qualities.ADVANCED]: {
    label: 'Advanced',
    tips: 'Uncommon, Rare, Epic, Legendary',
    srcName: 'advanced',
    rarity: [2, 3, 4, 5],
  },
  [qualities.SUPER]: {
    label: 'Super',
    tips: 'Rare, Epic, Legendary, Mythic',
    srcName: 'super',
    rarity: [3, 4, 5, 6],
  },
};
