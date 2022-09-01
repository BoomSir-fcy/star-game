import { SerializedPair, SerializedToken } from './actions';
export interface UserState {
    lastUpdateVersionTimestamp?: number;
    userExpertMode: boolean;
    userSingleHopOnly: boolean;
    userSlippageTolerance: number;
    userUsePoly: boolean;
    systemUsePoly: boolean;
    userDeadline: number;
    useFarmGet: boolean;
    useFarmPledge: boolean;
    useNestGet: boolean;
    useNestPledge: boolean;
    tokens: {
        [chainId: number]: {
            [address: string]: SerializedToken;
        };
    };
    pairs: {
        [chainId: number]: {
            [key: string]: SerializedPair;
        };
    };
    timestamp: number;
    audioPlay: boolean;
    isDark: boolean;
    vDsgInviteAddress: string;
}
export declare const initialState: UserState;
declare const _default: import("redux").Reducer<UserState, import("redux").AnyAction>;
export default _default;
