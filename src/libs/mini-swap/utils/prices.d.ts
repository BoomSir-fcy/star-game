import { CurrencyAmount, Percent, Trade } from 'dsgswap-sdk';
import { Field } from '../state/swap/actions';
export declare function computeTradePriceBreakdown(trade?: Trade | null): {
    priceImpactWithoutFee: Percent | undefined;
    realizedLPFee: CurrencyAmount | undefined | null;
};
export declare function computeSlippageAdjustedAmounts(trade: Trade | undefined, allowedSlippage: number): {
    [field in Field]?: CurrencyAmount;
};
export declare function warningSeverity(priceImpact: Percent | undefined, UserSlippageTolerance?: number): 0 | 1 | 2 | 3 | 4;
export declare function formatExecutionPrice(trade?: Trade, inverted?: boolean): string;
