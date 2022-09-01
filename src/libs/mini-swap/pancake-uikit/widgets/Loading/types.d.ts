import { BoxProps } from "../../components/Box";
export interface ModalTheme {
    background: string;
}
export declare type Handler = () => void;
export interface InjectedProps {
    onDismiss?: Handler;
}
export interface ModalProps extends InjectedProps, BoxProps {
    title: string;
    hideCloseButton?: boolean;
    onBack?: () => void;
    bodyPadding?: string;
    headerBackground?: string;
    minWidth?: string;
}
export declare enum LoadingType {
    HARVEST = 0,
    MEAT_MYSTERY = 1,
    EGG_MYSTERY = 2
}
export declare type TypeHandler = (type?: LoadingType, loaded?: boolean) => void;
