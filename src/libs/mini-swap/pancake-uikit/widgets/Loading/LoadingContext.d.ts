import React from "react";
import { Handler, LoadingType } from "./types";
interface ModalsContext {
    isOpen: boolean;
    nodeId: string;
    loadingType?: LoadingType;
    modalNode: React.ReactNode;
    setModalNode: React.Dispatch<React.SetStateAction<React.ReactNode>>;
    onPresent: (node: React.ReactNode, newNodeId: string) => void;
    setLoadingType: React.Dispatch<React.SetStateAction<LoadingType>>;
    setLoaded: React.Dispatch<React.SetStateAction<boolean>>;
    onTypePresent: (type: LoadingType, newNodeId: string) => void;
    onDismiss: Handler;
    setCloseOnOverlayClick: React.Dispatch<React.SetStateAction<boolean>>;
}
export declare const Context: React.Context<ModalsContext>;
declare const ModalProvider: React.FC;
export default ModalProvider;
