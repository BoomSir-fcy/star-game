import { LayoutProps, SpaceProps } from 'styled-system';

export const scales = {
  LD: 'ld',
  XL: 'xl',
  MD: 'md',
  SM: 'sm',
  XS: 'xs',
} as const;

export type Scales = typeof scales[keyof typeof scales];

export interface EmptyProps extends SpaceProps, LayoutProps {
  scale?: Scales;
  title?: string;
}
