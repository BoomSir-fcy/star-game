import { Token, TokenForChainId } from 'dsgswap-sdk';
import { Address } from 'config/constants/types';
export declare const getAddress: (address: Address) => string;
export declare const getToken: (token: TokenForChainId) => Token;
export declare const getDsgAddress: () => string;
export declare const getMulticallAddress: () => string;
export declare const getWbnbAddress: () => string;
