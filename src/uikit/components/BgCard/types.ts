import { HTMLAttributes } from "react";
import { SpaceProps } from "styled-system";

export const variants = {
  BIG: "big",
  FULL: "full",
  SMALL: "small",
  LONG: "long",
  MEDIUM: "medium",
  SHORT: "short",
} as const;

export type Variant = typeof variants[keyof typeof variants];

export interface BgCardProps extends SpaceProps, HTMLAttributes<HTMLDivElement> {
  variant?: Variant
  fringe?: boolean // 刘海
}
