import { BoxProps } from 'uikit';

export const qualities = {
  ORDINARY: 'ordinary', // 普通
  ADVANCED: 'advanced', // 高级
  SUPER: 'super', // 超级
} as const;

export type Qualities = typeof qualities[keyof typeof qualities];

export interface MysteryBoxComProps extends BoxProps {
  quality: Qualities;
}

export interface QualityProps {
  quality: Qualities;
}