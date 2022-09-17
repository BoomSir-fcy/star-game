import { Trade, CurrencyAmount } from 'dsgswap-sdk';
export declare enum ApprovalState {
    UNKNOWN = 0,
    NOT_APPROVED = 1,
    PENDING = 2,
    APPROVED = 3
}
export declare function useApproveCallback(amountToApprove?: CurrencyAmount, spender?: string): [ApprovalState, () => Promise<void>];
export declare function useApproveCallbackFromTrade(trade?: Trade, allowedSlippage?: number): [ApprovalState, () => Promise<void>];
export declare function useApproveCallbackFromTradeOrPoly(isPoly: boolean, trade?: Trade, currencyAmount?: CurrencyAmount, allowedSlippage?: number): [ApprovalState, () => Promise<void>];
export declare function useApproveCallbackPolyTrade(currencyAmount?: CurrencyAmount, spender?: string): [ApprovalState, () => Promise<void>];
