import React from 'react';
export declare const scales: {
    readonly LD: "ld";
    readonly MD: "md";
    readonly SM: "sm";
    readonly XS: "xs";
};
export declare type Scale = typeof scales[keyof typeof scales];
export declare enum SortType {
    DEFAULT = "default",
    UP = "up",
    DOWN = "down"
}
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
export interface SelectProps {
    options: OptionProps[];
    defaultId?: string | number;
    fillWidth?: boolean;
    activeIndex?: number;
    onChange?: (option: OptionProps) => void;
    onSortClick?: () => void;
    scale?: Scale;
    sort?: SortType;
}
export interface OptionProps {
    label: string;
    value: any;
    id?: string | number;
}
declare const Select: React.FunctionComponent<SelectProps>;
export default Select;
