/// <reference types="react" />
import { ImageProps, Variant } from "./types";
interface StyledImageProps extends ImageProps {
    variant: Variant;
}
export declare const StyledPrimaryImage: import("styled-components").StyledComponent<import("react").FC<import("./Logo").LogoProps>, import("styled-components").DefaultTheme, {
    shadow?: boolean;
} & StyledImageProps, never>;
export declare const StyledSecondaryImage: import("styled-components").StyledComponent<import("react").FC<import("./Logo").LogoProps>, import("styled-components").DefaultTheme, {
    shadow?: boolean;
} & StyledImageProps, never>;
export {};
