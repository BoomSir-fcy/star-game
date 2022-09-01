import { Currency, CurrencyAmount, Token, TokenAmount } from 'dsgswap-sdk';
/**
 * Returns a map of the given addresses to their eventually consistent BNB balances.
 */
export declare function useBNBBalances(uncheckedAddresses?: (string | undefined)[]): {
    [address: string]: CurrencyAmount | undefined;
};
/**
 * Returns a map of token addresses to their eventually consistent token balances for a single account.
 */
export declare function useTokenBalancesWithLoadingIndicator(address?: string, tokens?: (Token | undefined)[]): [{
    [tokenAddress: string]: TokenAmount | undefined;
}, boolean];
export declare function useTokenBalances(address?: string, tokens?: (Token | undefined)[]): {
    [tokenAddress: string]: TokenAmount | undefined;
};
export declare function useTokenBalance(account?: string, token?: Token): TokenAmount | undefined;
export declare function useCurrencyBalances(account?: string, currencies?: (Currency | undefined)[]): (CurrencyAmount | undefined)[];
export declare function useCurrencyBalance(account?: string, currency?: Currency): CurrencyAmount | undefined;
export declare function useAllTokenBalances(): {
    [tokenAddress: string]: TokenAmount | undefined;
};
