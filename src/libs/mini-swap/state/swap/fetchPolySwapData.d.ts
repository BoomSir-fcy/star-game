import { PolyDataIndex } from 'state/types';
declare const fetchPolySwapData: (chanId: any, data: PolyDataIndex) => Promise<any>;
export declare const fetchPolyQuoteData: (chanId: any, data: PolyDataIndex) => Promise<any>;
export declare const fetchSpenderAddress: (chanId: any) => Promise<any>;
export declare const fetchAllowancceAmount: (spender: string, account: string, tokenAddress: string) => Promise<any>;
export declare const fetchApproveCallData: (chanId: any, tokenAddress: string) => Promise<any>;
export default fetchPolySwapData;
