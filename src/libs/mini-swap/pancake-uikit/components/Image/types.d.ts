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
    wrapperProps?: WrapperProps;
}
export declare const variants: {
    readonly DEFAULT: "default";
    readonly INVERTED: "inverted";
    readonly BINARY: "binary";
};
export declare type Variant = typeof variants[keyof typeof variants];
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
