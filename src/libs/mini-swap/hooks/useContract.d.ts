import { Contract } from '@ethersproject/contracts';
/**
 * Helper hooks to get specific contracts (by ABI)
 */
export declare const useERC20: (address: string) => Contract;
/**
 * @see https://docs.openzeppelin.com/contracts/3.x/api/token/erc721
 */
export declare const useERC721: (address: string) => Contract;
export declare function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null;
export declare function useWETHContract(withSignerIfPossible?: boolean): Contract | null;
export declare function useENSRegistrarContract(withSignerIfPossible?: boolean): Contract | null;
export declare function useENSResolverContract(address: string | undefined, withSignerIfPossible?: boolean): Contract | null;
export declare function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null;
export declare function usePairContract(pairAddress?: string, withSignerIfPossible?: boolean): Contract | null;
export declare function useMulticallContract(): Contract | null;
