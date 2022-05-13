import { qualities } from './types';

export const mysteryConfig = {
  [qualities.ORDINARY]: {
    label: 'Ordinary',
    tips: 'Common, Good, or Rare Planet',
    srcName: 'ordinary',
  },
  [qualities.ADVANCED]: {
    label: 'Advanced',
    tips: 'Good, Rare, or Epic Planet',
    srcName: 'advanced',
  },
  [qualities.SUPER]: {
    label: 'Super',
    tips: 'Epic, Legend, or Myth Planet',
    srcName: 'super',
  },
};
