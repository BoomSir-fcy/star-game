import { MediaQueries, Breakpoints, Spacing, MediaQueriesSize } from "./types";
export declare const breakpointMap: {
    [key: string]: number;
};
export declare const mediaQueries: MediaQueries;
export declare const mediaQueriesSize: MediaQueriesSize;
export declare const shadows: {
    level1: string;
    active: string;
    success: string;
    warning: string;
    focus: string;
    input: string;
    inset: string;
    box: string;
    nav: string;
};
declare const _default: {
    siteWidth: number;
    breakpoints: Breakpoints;
    mediaQueries: MediaQueries;
    spacing: Spacing;
    shadows: {
        level1: string;
        active: string;
        success: string;
        warning: string;
        focus: string;
        input: string;
        inset: string;
        box: string;
        nav: string;
    };
    radii: {
        small: string;
        default: string;
        nftImage: string;
        card: string;
        circle: string;
    };
    zIndices: {
        dropdown: number;
        modal: number;
    };
    mediaQueriesSize: MediaQueriesSize;
};
export default _default;
