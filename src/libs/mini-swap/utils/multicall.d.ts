import { MultiCallResponse } from './types';
export interface Call {
    address: string;
    name: string;
    params?: any[];
}
interface MulticallOptions {
    requireSuccess?: boolean;
}
declare const multicall: <T = any>(abi: any[], calls: Call[]) => Promise<T>;
/**
 * Multicall V2 uses the new "tryAggregate" function. It is different in 2 ways
 *
 * 1. If "requireSuccess" is false multicall will not bail out if one of the calls fails
 * 2. The return inclues a boolean whether the call was successful e.g. [wasSuccessfull, callResult]
 */
export declare const multicallv2: <T = any>(abi: any[], calls: Call[], options?: MulticallOptions) => Promise<T>;
export default multicall;
