import React from "react";
import { Handler, TypeHandler } from "./types";
declare const useModal: (modal?: React.ReactNode, closeOnOverlayClick?: boolean, updateOnPropsChange?: boolean, modalId?: string) => [TypeHandler, Handler, (node: React.ReactNode, d?: number) => void];
export default useModal;
