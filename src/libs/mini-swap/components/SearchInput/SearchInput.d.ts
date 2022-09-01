import React from 'react';
export declare const scales: {
    readonly LD: "ld";
    readonly MD: "md";
    readonly SM: "sm";
    readonly XS: "xs";
};
export declare type Scale = typeof scales[keyof typeof scales];
export declare const scaleVariants: {
    ld: {
        minWidth: string;
        minWidthBig: string;
    };
    md: {
        minWidth: string;
        minWidthBig: string;
    };
    sm: {
        minWidth: string;
        minWidthBig: string;
    };
    xs: {
        minWidth: string;
        minWidthBig: string;
    };
};
interface Props {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onResetVal?: (value: string) => void;
    placeholder?: string;
    scale?: Scale;
}
declare const SearchInput: React.FC<Props>;
export default SearchInput;
