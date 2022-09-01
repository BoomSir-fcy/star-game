import { LayoutProps, SpaceProps } from "styled-system";
export declare const scales: {
    readonly SM: "sm";
    readonly MD: "md";
    readonly LG: "lg";
};
export declare type Scales = typeof scales[keyof typeof scales];
export interface EmptyProps extends SpaceProps, LayoutProps {
    scale?: Scales;
}
