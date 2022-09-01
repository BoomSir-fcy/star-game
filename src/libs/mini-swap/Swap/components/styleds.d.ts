/// <reference types="react" />
export declare const Wrapper: import("styled-components").StyledComponent<"div", import("styled-components").DefaultTheme, {}, never>;
export declare const ArrowWrapper: import("styled-components").StyledComponent<"div", import("styled-components").DefaultTheme, {
    clickable: boolean;
}, never>;
export declare const ErrorText: import("styled-components").StyledComponent<"div", import("styled-components").DefaultTheme, import("pancake-uikit").TextProps & {
    severity?: 0 | 1 | 2 | 3 | 4;
}, never>;
export declare const StyledBalanceMaxMini: import("styled-components").StyledComponent<"button", import("styled-components").DefaultTheme, {}, never>;
export declare const TruncatedText: import("styled-components").StyledComponent<"div", import("styled-components").DefaultTheme, import("pancake-uikit").TextProps & {
    ellipsis: boolean;
}, "ellipsis">;
export declare function SwapCallbackError({ error }: {
    error: string;
}): JSX.Element;
export declare const SwapShowAcceptChanges: import("styled-components").StyledComponent<"div", import("styled-components").DefaultTheme, {
    gap?: string;
    justify?: "center" | "end" | "start" | "stretch" | "flex-start" | "flex-end" | "space-between";
}, never>;
