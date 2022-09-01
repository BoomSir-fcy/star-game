import React from 'react';
import { BoxProps } from '../Box';
interface InputPanelStyled extends BoxProps {
    isWarning?: boolean;
    background?: string;
    warning?: React.ReactNode;
}
declare const InputPanelStyled: import("styled-components").StyledComponent<"div", import("styled-components").DefaultTheme, BoxProps & InputPanelStyled, never>;
export default function InputPanel({ children, isWarning, warning, ...props }: InputPanelStyled): JSX.Element;
export {};
