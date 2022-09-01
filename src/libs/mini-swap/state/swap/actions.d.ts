import { PolyDataIndex } from '../types';
export declare enum Field {
    INPUT = "INPUT",
    OUTPUT = "OUTPUT"
}
export declare const selectCurrency: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    field: Field;
    currencyId: string;
}, string>;
export declare const switchCurrencies: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<string>;
export declare const typeInput: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    field: Field;
    typedValue: string;
}, string>;
export declare const replaceSwapState: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    field: Field;
    typedValue: string;
    inputCurrencyId?: string;
    outputCurrencyId?: string;
    recipient: string | null;
}, string>;
export declare const setRecipient: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    recipient: string | null;
}, string>;
export declare const updatePolyDataIndex: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    data: PolyDataIndex;
}, string>;
export declare const resetPolyData: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<null, string>;
