import { Field } from './actions';
import { PolySwapState, PolyData, PolyDataIndex } from '../types';
export interface SwapState extends PolySwapState {
    readonly independentField: Field;
    readonly typedValue: string;
    readonly [Field.INPUT]: {
        readonly currencyId: string | undefined;
    };
    readonly [Field.OUTPUT]: {
        readonly currencyId: string | undefined;
    };
    readonly recipient: string | null;
}
export declare const fetchPolySwapDataAsync: import("@reduxjs/toolkit").AsyncThunk<PolyData, {
    chainId: number;
    polyQueryData: PolyDataIndex;
}, {}>;
export declare const fetchPolyAllowaceAsync: import("@reduxjs/toolkit").AsyncThunk<{
    spender: string;
    allowance: {
        tokenAddress: string;
        allowance: string;
    };
}, {
    chainId: number;
    account: string;
    tokenAddress: string;
}, {}>;
export declare const fetchPolySpenderAsync: import("@reduxjs/toolkit").AsyncThunk<string, number, {}>;
declare const _default: import("redux").Reducer<SwapState, import("redux").AnyAction>;
export default _default;
