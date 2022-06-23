import { BoxProps } from 'uikit';
import { RaceType, Races } from 'uikit/theme/types';

export interface RaceAvatarProps extends BoxProps {
  width?: string;
  height?: string;
  race: Races;
}

export const raceImage = {
  [RaceType.PROTOSS]: '/images/commons/protoss.png', // 神族
  [RaceType.HUMAN]: '/images/commons/human.png', // 人族
  [RaceType.ZERG]: '/images/commons/zerg.png', // 虫族
};
