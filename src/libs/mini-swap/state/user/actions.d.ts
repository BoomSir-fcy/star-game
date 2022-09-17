export interface SerializedToken {
    chainId: number;
    address: string;
    decimals: number;
    symbol?: string;
    name?: string;
}
export interface SerializedPair {
    token0: SerializedToken;
    token1: SerializedToken;
}
export declare const updateUserExpertMode: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    userExpertMode: boolean;
}, string>;
export declare const updateUserUsePloy: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    userUsePoly: boolean;
}, string>;
export declare const updateSystemUsePloy: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    systemUsePoly: boolean;
}, string>;
export declare const updateUserSingleHopOnly: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    userSingleHopOnly: boolean;
}, string>;
export declare const updateUserSlippageTolerance: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    userSlippageTolerance: number;
}, string>;
export declare const updateUserDeadline: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    userDeadline: number;
}, string>;
export declare const addSerializedToken: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    serializedToken: SerializedToken;
}, string>;
export declare const removeSerializedToken: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    chainId: number;
    address: string;
}, string>;
export declare const addSerializedPair: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    serializedPair: SerializedPair;
}, string>;
export declare const removeSerializedPair: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    chainId: number;
    tokenAAddress: string;
    tokenBAddress: string;
}, string>;
export declare const muteAudio: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<string>;
export declare const unmuteAudio: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<string>;
export declare const toggleTheme: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<string>;
export declare const setVDsgInviteAddress: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    address: string;
}, string>;
export declare const updateUseFarmGet: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    useFarmGet: boolean;
}, string>;
export declare const updateUseFarmPledge: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    useFarmPledge: boolean;
}, string>;
export declare const updateUseNestGet: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    useNestGet: boolean;
}, string>;
export declare const updateUseNestPledge: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    useNestPledge: boolean;
}, string>;
