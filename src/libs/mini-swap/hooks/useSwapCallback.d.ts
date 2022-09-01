import { Trade } from 'dsgswap-sdk';
export declare enum SwapCallbackState {
    INVALID = 0,
    LOADING = 1,
    VALID = 2
}
export declare function useSwapCallback(trade: Trade | undefined, // trade to execute, required
allowedSlippage: number, // in bips
recipientAddressOrName: string | null): {
    state: SwapCallbackState;
    callback: null | (() => Promise<string>);
    error: string | null;
};
