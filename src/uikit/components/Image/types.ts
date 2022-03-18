import { HTMLAttributes, ImgHTMLAttributes } from "react";
import { SpaceProps } from "styled-system";
import { BoxProps } from "../Box";

export interface WrapperProps extends SpaceProps, HTMLAttributes<HTMLDivElement> {
  width: number;
  height: number;
}

export interface ImageProps extends ImgHTMLAttributes<HTMLImageElement>, SpaceProps {
  width: number;
  height: number;
  userDrag?: string;
  borderRadius?: string;
  wrapperProps?: WrapperProps;
}

export const variants = {
  DEFAULT: "default",
  INVERTED: "inverted",
  BINARY: "binary",
} as const;

export type Variant = typeof variants[keyof typeof variants];

export interface TokenPairImageProps extends BoxProps {
  primarySrc?: string;
  secondarySrc?: string;
  primarySrcs?: string[];
  secondarySrcs?: string[];
  variant?: Variant;
  shadow?: boolean;
  height: number;
  width: number;
  primaryImageProps?: Omit<ImageProps, "width" | "height">;
  secondaryImageProps?: Omit<ImageProps, "width" | "height">;
}
