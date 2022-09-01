import { Pair, Currency } from 'dsgswap-sdk';
export declare enum PairState {
    LOADING = 0,
    NOT_EXISTS = 1,
    EXISTS = 2,
    INVALID = 3
}
export declare function usePairs(currencies: [Currency | undefined, Currency | undefined][]): [PairState, Pair | null][];
export declare function usePair(tokenA?: Currency, tokenB?: Currency): [PairState, Pair | null];
