import { qualities as Qualities, RaceType } from 'uikit/theme/types';

export const RaceOptions = (t: any) => {
  return [
    {
      value: 0,
      label: t('所有种族'),
    },
    {
      value: RaceType.PROTOSS,
      label: t('race-1'),
    },
    {
      value: RaceType.HUMAN,
      label: t('race-2'),
    },
    {
      value: RaceType.ZERG,
      label: t('race-3'),
    },
  ];
};

export const RarityOptions = (t: any) => {
  return [
    {
      value: 0,
      label: t('所有稀有度'),
    },
    {
      value: Qualities.ORDINARY,
      label: t('rarity-1'),
    },
    {
      value: Qualities.GOOD,
      label: t('rarity-2'),
    },
    {
      value: Qualities.RARE,
      label: t('rarity-3'),
    },
    {
      value: Qualities.EPIC,
      label: t('rarity-4'),
    },
    {
      value: Qualities.LEGEND,
      label: t('rarity-5'),
    },
    {
      value: Qualities.MYTHOLOGY,
      label: t('rarity-6'),
    },
  ];
};

export const LevelOptions = (maxLevel = 20) => {
  const LevelList = [
    {
      value: 0,
      label: '所有等级',
    },
  ];
  for (let i = 1; i <= maxLevel; i++) {
    LevelList.push({
      value: i,
      label: `Lv ${i}`,
    });
  }
  return LevelList;
};
