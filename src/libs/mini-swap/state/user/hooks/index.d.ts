import { Pair, Token } from 'dsgswap-sdk';
export declare function useAudioModeManager(): [boolean, () => void];
export declare function useIsExpertMode(): boolean;
export declare function useExpertModeManager(): [boolean, () => void];
export declare function useThemeManager(): [boolean, () => void];
export declare function useUserSingleHopOnly(): [boolean, (newSingleHopOnly: boolean) => void];
export declare function useUserSlippageTolerance(): [number, (slippage: number) => void];
export declare function useUserUsePoly(): [boolean, (usePoly: boolean) => void];
export declare function useUseFarmGet(): [boolean, (usePoly: boolean) => void];
export declare function useUseFarmPledge(): [boolean, (usePoly: boolean) => void];
export declare function useUseNestGet(): [boolean, (usePoly: boolean) => void];
export declare function useUseNestPledge(): [boolean, (usePoly: boolean) => void];
export declare function useSystemUsePoly(): [boolean, (usePoly: boolean) => void];
export declare function useVDsgInviteAddress(): [string, (address: string) => void];
export declare function useUserTransactionTTL(): [number, (slippage: number) => void];
export declare function useAddUserToken(): (token: Token) => void;
export declare function useRemoveUserAddedToken(): (chainId: number, address: string) => void;
export declare function usePairAdder(): (pair: Pair) => void;
/**
 * Given two tokens return the liquidity token that represents its liquidity shares
 * @param tokenA one of the two tokens
 * @param tokenB the other token
 */
export declare function toV2LiquidityToken([tokenA, tokenB]: [Token, Token]): Token;
/**
 * Returns all the pairs of tokens that are tracked by the user for the current chain ID.
 */
export declare function useTrackedTokenPairs(): [Token, Token][];
