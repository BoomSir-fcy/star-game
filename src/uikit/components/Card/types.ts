import { HTMLAttributes } from 'react';
import {
  SpaceProps,
  LayoutProps,
  BorderProps,
  PositionProps,
  BackgroundProps,
} from 'styled-system';
import { Colors } from '../../theme/types';

export interface CardRibbonProps
  extends SpaceProps,
    HTMLAttributes<HTMLDivElement> {
  variantColor?: keyof Colors;
  text: string;
  ribbonPosition?: 'right' | 'left';
}

export type CardTheme = {
  background: string;
  boxShadow: string;
  boxShadowActive: string;
  boxShadowSuccess: string;
  boxShadowWarning: string;
  cardHeaderBackground: {
    bubblegum: string;
  };
  dropShadow: string;
};

export interface CardProps
  extends SpaceProps,
    LayoutProps,
    HTMLAttributes<HTMLDivElement> {
  isActive?: boolean;
  isSuccess?: boolean;
  isWarning?: boolean;
  isDisabled?: boolean;
  ribbon?: React.ReactNode;
}

export interface BorderCardProps
  extends SpaceProps,
    LayoutProps,
    BorderProps,
    PositionProps,
    BackgroundProps,
    HTMLAttributes<HTMLDivElement> {
  isActive?: boolean;
  borderWidth?: number;
}

export interface GraphicsCardProps extends CardProps {
  width?: string;
  height?: string;
  radius?: boolean;
}
