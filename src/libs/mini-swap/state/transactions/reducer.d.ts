import { SerializableTransactionReceipt } from './actions';
export interface TransactionDetails {
    hash: string;
    approval?: {
        tokenAddress: string;
        spender: string;
    };
    summary?: string;
    claim?: {
        recipient: string;
    };
    receipt?: SerializableTransactionReceipt;
    lastCheckedBlockNumber?: number;
    addedTime: number;
    confirmedTime?: number;
    from: string;
}
export interface TransactionState {
    [chainId: number]: {
        [txHash: string]: TransactionDetails;
    };
}
export declare const initialState: TransactionState;
declare const _default: import("redux").Reducer<TransactionState, import("redux").AnyAction>;
export default _default;
