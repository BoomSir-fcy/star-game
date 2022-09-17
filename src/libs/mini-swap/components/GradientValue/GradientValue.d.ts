import React from 'react';
import { BoxProps } from 'pancake-uikit';
export interface GradientValueProps extends BoxProps {
    value?: string;
    fontSize?: string;
    fontSizeSM?: string;
    background?: string;
    textAlign?: string;
    color?: string;
    bold?: boolean;
}
declare const GradientValue: React.FC<GradientValueProps>;
export default GradientValue;
