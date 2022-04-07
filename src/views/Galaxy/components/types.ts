import { BoxProps } from 'uikit';

export const sexs = {
  MAN: 'man',
  WOMAN: 'woman',
  NORMAL: 'normal',
} as const;
export const sexImages = {
  man: '/images/login/a-man.png',
  woman: '/images/login/a-woman.png',
  normal: '/images/login/a-man.png',
} as const;
export const sexBorderImages = {
  man: '/images/login/a-b-man.png',
  woman: '/images/login/a-b-woman.png',
  normal: '/images/login/a-b-no.png',
} as const;

export type Sex = typeof sexs[keyof typeof sexs];

export interface KingAvatarProps extends BoxProps {
  sex?: Sex;
  width?: string;
  height?: string;
  url?: string;
}
