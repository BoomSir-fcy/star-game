import React from "react";
import { ModalProps } from "./types";
export declare const ModalHeader: import("styled-components").StyledComponent<"div", import("styled-components").DefaultTheme, {
    background?: string;
}, never>;
export declare const ModalTitle: import("styled-components").StyledComponent<"div", import("styled-components").DefaultTheme, import("../../components/Box").BoxProps & import("../../components/Box").FlexProps, never>;
export declare const ModalBody: import("styled-components").StyledComponent<"div", import("styled-components").DefaultTheme, import("../../components/Box").BoxProps & import("../../components/Box").FlexProps, never>;
export declare const ModalCloseButton: React.FC<{
    onDismiss: ModalProps["onDismiss"];
}>;
export declare const ModalBackButton: React.FC<{
    onBack: ModalProps["onBack"];
}>;
export declare const ModalContainer: import("styled-components").StyledComponent<"div", import("styled-components").DefaultTheme, import("../../components/Box").BoxProps & {
    minWidth: string;
}, never>;
export declare const LoadingContainer: import("styled-components").StyledComponent<"div", import("styled-components").DefaultTheme, import("../../components/Box").BoxProps, never>;
export declare const VideoStyled: import("styled-components").StyledComponent<"video", import("styled-components").DefaultTheme, {}, never>;
export declare const ImageStyled: import("styled-components").StyledComponent<"img", import("styled-components").DefaultTheme, {
    zIndex?: number;
}, never>;
export declare const ChildrenWrapper: import("styled-components").StyledComponent<"div", import("styled-components").DefaultTheme, import("../../components/Box").BoxProps, never>;
export declare const ShadowBox: import("styled-components").StyledComponent<"div", import("styled-components").DefaultTheme, import("../../components/Box").BoxProps, never>;
export declare const BoxAnimationStyled: import("styled-components").StyledComponent<"div", import("styled-components").DefaultTheme, import("../../components/Box").BoxProps, never>;
export declare const WrapperAnimationStyled: import("styled-components").StyledComponent<"div", import("styled-components").DefaultTheme, import("../../components/Box").BoxProps, never>;
