import { BoxProps } from 'uikit';

export interface RaceAvatarProps extends BoxProps {
  width?: string;
  height?: string;
  race: Race;
}

export const race = {
  PROTOSS: 'protoss', // 神族
  HUMAN: 'human', // 人族
  ZERG: 'zerg', // 虫族
} as const;

export type Race = typeof race[keyof typeof race];

export const raceImage = {
  [race.PROTOSS]: '/images/commons/star/protoss.png', // 神族
  [race.HUMAN]: '/images/commons/star/human-race.png', // 人族
  [race.ZERG]: '/images/commons/star/zerg.png', // 虫族
};
