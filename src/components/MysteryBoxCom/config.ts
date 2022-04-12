import { qualities } from './types';

export const mysteryConfig = {
  [qualities.ORDINARY]: {
    label: 'Ordinary',
    tips: 'Common, Good, Rare Planets',
    srcName: 'ordinary',
  },
  [qualities.ADVANCED]: {
    label: 'Advanced',
    tips: 'Good, Rare, Epic Planets',
    srcName: 'advanced',
  },
  [qualities.SUPER]: {
    label: 'Super',
    tips: 'Epic, Legendary, Mythical Planet',
    srcName: 'super',
  },
};
