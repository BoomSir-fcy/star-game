import { ComponentProps, ElementType, ReactElement, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { LayoutProps, SpaceProps } from 'styled-system';

export const scales = {
  LD: 'ld',
  MD: 'md',
  SM: 'sm',
  XS: 'xs',
} as const;

export const variants = {
  LOGIN: 'login',
  GHOST: 'ghost',
  CUSTOM: 'custom',
  PRIMARY: 'primary',
  DANGER: 'danger',
  SECONDARY: 'secondary',
  S2_LONG: 's2-long',
  TERTIARY: 'tertiary',
  TEXT: 'text',
  VS: 'vs',
  VS_REFRESH: 'vsRefresh',
  BLACK: 'black',
  STOP: 'stop',
  PURPLE: 'purple',
  TRANSPARENT: 'transparent',
  GOLD: 'gold',
  PURPLESHOW: 'purpleShow',
} as const;

export type Scale = typeof scales[keyof typeof scales];
export type Variant = typeof variants[keyof typeof variants];

/**
 * @see https://www.benmvp.com/blog/polymorphic-react-components-typescript/
 */
export type AsProps<E extends ElementType = ElementType> = {
  as?: E;
};

export type MergeProps<E extends ElementType> = AsProps<E> &
  Omit<ComponentProps<E>, keyof AsProps>;

export type PolymorphicComponentProps<E extends ElementType, P> = P &
  MergeProps<E>;

export type PolymorphicComponent<P, D extends ElementType = 'button'> = <
  E extends ElementType = D,
>(
  props: PolymorphicComponentProps<E, P>,
) => ReactElement | null;

export interface BaseButtonProps extends LayoutProps, SpaceProps {
  as?: 'a' | 'button' | typeof Link;
  external?: boolean;
  isLoading?: boolean;
  scale?: Scale;
  variant?: Variant;
  disabled?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

export type ButtonProps<P extends ElementType = 'button'> =
  PolymorphicComponentProps<P, BaseButtonProps>;

export type ButtonOnRefresh = () => Promise<any>;
export type ButtonOnBack = () => void;
