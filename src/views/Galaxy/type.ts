import { NavConfig } from 'components/Nav/types';

export interface StarsLevel extends NavConfig {
  levels?: number[];
}

export interface StarInfo {
  lv?: number;
}
