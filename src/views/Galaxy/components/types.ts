import { BoxProps } from 'uikit';

export const sexs = {
  MAN: 'man',
  WOMAN: 'woman',
} as const;
export const sexImages = {
  man: '/images/login/a-man.png',
  woman: '/images/login/a-woman.png',
} as const;

export type Sex = typeof sexs[keyof typeof sexs];

export interface KingAvatarProps extends BoxProps {
  sex?: Sex;
  width?: string;
  height?: string;
}