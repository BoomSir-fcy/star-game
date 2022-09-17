/// <reference types="react" />
export declare type Position = "top" | "top-right" | "bottom" | "bottom-right";
export interface PositionProps {
    position?: Position;
}
export interface DropdownProps extends PositionProps {
    target: React.ReactElement;
}
