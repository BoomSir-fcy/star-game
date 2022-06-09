import { HTMLAttributes } from 'react';
import { SpaceProps } from 'styled-system';
import { Qualities } from 'uikit/theme/types';

export const scales = {
  LD: 'ld',
  MD: 'md',
  SM: 'sm',
  XS: 'xs',
} as const;

export type Scale = typeof scales[keyof typeof scales];

export const variants = {
  RING: 'ring',
  SQUARE: 'square',
  NONE: 'none',
} as const;

export type Variant = typeof variants[keyof typeof variants];

export interface StarProps extends SpaceProps, HTMLAttributes<HTMLDivElement> {
  quality?: Qualities;
  variant?: Variant;
  scale?: Scale;
  showUnion?: boolean;
  picture?: string; // 渲染后材质
  picture1?: string; // 渲染前材质
  three?: boolean; // 是否3d渲染
}
