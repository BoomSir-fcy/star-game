import { LayoutProps, SpaceProps, TypographyProps } from 'styled-system';
import { TextShadows } from '../../theme/types';

type TextShadow = keyof TextShadows;
export interface TextProps extends SpaceProps, TypographyProps, LayoutProps {
  color?: string;
  shadow?: TextShadow;
  fontSize?: string;
  bold?: boolean;
  small?: boolean;
  ellipsis?: boolean;
  textTransform?: 'uppercase' | 'lowercase' | 'capitalize';
  maxLine?: number;
  mark?: boolean;
  vip?: boolean;
}
