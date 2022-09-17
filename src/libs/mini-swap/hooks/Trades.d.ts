import { Currency, CurrencyAmount, Trade } from 'dsgswap-sdk';
/**
 * Returns the best trade for the exact amount of tokens in to the given token out
 */
export declare function useTradeExactIn(currencyAmountIn?: CurrencyAmount, currencyOut?: Currency, poly?: boolean): Trade | null;
/**
 * Returns the best trade for the token in to the exact amount of token out
 */
export declare function useTradeExactOut(currencyIn?: Currency, currencyAmountOut?: CurrencyAmount, poly?: boolean): Trade | null;
export declare function useIsTransactionUnsupported(currencyIn?: Currency, currencyOut?: Currency): boolean;
