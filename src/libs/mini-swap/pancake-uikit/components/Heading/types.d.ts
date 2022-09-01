export declare const tags: {
    H1: string;
    H2: string;
    H3: string;
    H4: string;
    H5: string;
    H6: string;
};
export declare const scales: {
    readonly SM: "sm";
    readonly LD: "ld";
    readonly MD: "md";
    readonly LG: "lg";
    readonly LGG: "lgg";
    readonly LX: "lx";
    readonly XL: "xl";
    readonly XLD: "xld";
    readonly XXL: "xxl";
    readonly XXXL: "xxxl";
    readonly XXLD: "xxld";
};
export declare type Tags = typeof tags[keyof typeof tags];
export declare type Scales = typeof scales[keyof typeof scales];
export interface HeadingProps {
    as?: Tags;
    scale?: Scales;
}
