import { BoxProps } from 'uikit';
import { RaceType, Races } from 'uikit/theme/types';

export interface RaceAvatarProps extends BoxProps {
  width?: string;
  height?: string;
  race: Races;
}

export const raceImage = {
  [RaceType.PROTOSS]: '/images/commons/star/protoss.png', // 神族
  [RaceType.HUMAN]: '/images/commons/star/human-race.png', // 人族
  [RaceType.ZERG]: '/images/commons/star/zerg.png', // 虫族
};
