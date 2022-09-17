import { ChainId } from 'dsgswap-sdk';
export interface SerializableTransactionReceipt {
    to: string;
    from: string;
    contractAddress: string;
    transactionIndex: number;
    blockHash: string;
    transactionHash: string;
    blockNumber: number;
    status?: number;
}
export declare const addTransaction: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    chainId: ChainId;
    hash: string;
    from: string;
    approval?: {
        tokenAddress: string;
        spender: string;
    };
    claim?: {
        recipient: string;
    };
    summary?: string;
}, string>;
export declare const clearAllTransactions: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    chainId: ChainId;
}, string>;
export declare const finalizeTransaction: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    chainId: ChainId;
    hash: string;
    receipt: SerializableTransactionReceipt;
}, string>;
export declare const checkedTransaction: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    chainId: ChainId;
    hash: string;
    blockNumber: number;
}, string>;
