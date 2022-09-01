import React from 'react';
import { TextProps } from 'pancake-uikit';
interface BalanceProps extends TextProps {
    value: number;
    decimals?: number;
    unit?: string;
    isDisabled?: boolean;
    prefix?: string;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}
declare const Balance: React.FC<BalanceProps>;
export default Balance;
