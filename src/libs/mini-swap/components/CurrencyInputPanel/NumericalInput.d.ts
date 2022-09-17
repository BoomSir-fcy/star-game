import React from 'react';
export declare const Input: React.NamedExoticComponent<{
    value: string | number;
    onUserInput: (input: string) => void;
    error?: boolean;
    disabled?: boolean;
    fontSize?: string;
    decimals?: number;
    align?: 'right' | 'left';
} & Omit<React.HTMLProps<HTMLInputElement>, "ref" | "onChange" | "as">>;
export default Input;
