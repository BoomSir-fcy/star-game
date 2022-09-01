import React from "react";
import { BoxProps } from "../../components/Box";
import { LoadingType } from "./types";
interface LoadingProps extends BoxProps {
    loadingType: LoadingType;
    loaded: boolean;
}
declare const Loading: React.FC<LoadingProps>;
export default Loading;
