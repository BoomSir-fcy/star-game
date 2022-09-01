export declare const scales: {
    readonly XS: "xs";
    readonly SM: "sm";
    readonly MD: "md";
};
export declare type Scales = typeof scales[keyof typeof scales];
export interface CheckboxProps {
    scale?: Scales;
}
