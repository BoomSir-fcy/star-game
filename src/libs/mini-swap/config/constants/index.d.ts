import { ChainId, JSBI, Percent, Token } from 'dsgswap-sdk';
declare type ChainTokenList = {
    readonly [chainId in ChainId]: Token[];
};
export declare const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList;
/**
 * Addittional bases for specific tokens
 * @example { [WBTC.address]: [renBTC], [renBTC.address]: [WBTC] }
 */
export declare const ADDITIONAL_BASES: {
    [chainId in ChainId]?: {
        [tokenAddress: string]: Token[];
    };
};
/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 * @example [AMPL.address]: [DAI, WETHER[ChainId.MAINNET]]
 */
export declare const CUSTOM_BASES: {
    [chainId in ChainId]?: {
        [tokenAddress: string]: Token[];
    };
};
export declare const SUGGESTED_BASES: ChainTokenList;
export declare const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList;
export declare const PINNED_PAIRS: {
    readonly [chainId in ChainId]?: [Token, Token][];
};
export declare const NetworkContextName = "NETWORK";
export declare const INITIAL_ALLOWED_SLIPPAGE = 50;
export declare const DEFAULT_DEADLINE_FROM_NOW: number;
export declare const BIG_INT_ZERO: JSBI;
export declare const ONE_BIPS: Percent;
export declare const BIPS_BASE: JSBI;
export declare const ALLOWED_PRICE_IMPACT_LOW: Percent;
export declare const ALLOWED_PRICE_IMPACT_MEDIUM: Percent;
export declare const ALLOWED_PRICE_IMPACT_HIGH: Percent;
export declare const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent;
export declare const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent;
export declare const MIN_BNB: JSBI;
export declare const BETTER_TRADE_LESS_HOPS_THRESHOLD: Percent;
export declare const ZERO_PERCENT: Percent;
export declare const ONE_HUNDRED_PERCENT: Percent;
export declare const BLOCKED_ADDRESSES: string[];
export declare const SINGLE_POOL_STAKE_ONLY_NEST: string[];
export declare const MBT_TO_FRAGMENT_RATE: {
    MBTPF: number;
    MBTCF: number;
};
export {};
