import { BoxProps } from 'uikit';

export const qualities = {
  ORDINARY: 0, // 普通
  ADVANCED: 1, // 高级
  SUPER: 2, // 超级
} as const;

export type Qualities = typeof qualities[keyof typeof qualities];

export interface MysteryBoxComProps extends BoxProps {
  quality: Qualities;
  text?: string;
  rotate?: number;
  handleClick?: () => void;
}

export interface QualityProps {
  quality: Qualities;
}
