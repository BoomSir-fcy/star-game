import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { TokenList, Version } from '@uniswap/token-lists';
export declare const fetchTokenList: Readonly<{
    pending: ActionCreatorWithPayload<{
        url: string;
        requestId: string;
        chainId: number;
    }>;
    fulfilled: ActionCreatorWithPayload<{
        url: string;
        tokenList: TokenList;
        requestId: string;
        chainId: number;
    }>;
    rejected: ActionCreatorWithPayload<{
        url: string;
        errorMessage: string;
        requestId: string;
        chainId: number;
    }>;
}>;
export declare const addList: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<string, string>;
export declare const removeList: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<string, string>;
export declare const enableList: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<string, string>;
export declare const disableList: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<string, string>;
export declare const acceptListUpdate: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<string, string>;
export declare const rejectVersionUpdate: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<Version, string>;
export declare const acceptListUpdateOfChainId: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<number, string>;
