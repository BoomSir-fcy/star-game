import { qualities } from './types';

export const mysteryConfig = {
  [qualities.ORDINARY]: {
    label: 'Ordinary',
    tips: 'Common, Uncommon, or Rare Planet',
    srcName: 'ordinary',
  },
  [qualities.ADVANCED]: {
    label: 'Advanced',
    tips: 'Uncommon, Rare, or Epic Planet',
    srcName: 'advanced',
  },
  [qualities.SUPER]: {
    label: 'Super',
    tips: 'Epic, Legendary, or Mythic Planet',
    srcName: 'super',
  },
};
