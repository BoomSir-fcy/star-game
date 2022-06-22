import { HTMLAttributes } from 'react';
import { SpaceProps } from 'styled-system';

export const variants = {
  BIG: 'big',
  S_FULL: 'sFull',
  FULL: 'full',
  SMALL: 'small',
  LONG: 'long',
  LONG_MEDIUM: 'longMedium',
  MEDIUM: 'medium',
  SHORT: 'short',
  FULLSCREEN: 'Fullscreen',
  SL: 'Sl',
} as const;

export type Variant = typeof variants[keyof typeof variants];

export interface BgCardProps
  extends SpaceProps,
    HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  fringe?: boolean; // 刘海
}
