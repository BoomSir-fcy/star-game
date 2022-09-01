export declare enum Field {
    LIQUIDITY_PERCENT = "LIQUIDITY_PERCENT",
    LIQUIDITY = "LIQUIDITY",
    CURRENCY_A = "CURRENCY_A",
    CURRENCY_B = "CURRENCY_B"
}
export declare const typeInput: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    field: Field;
    typedValue: string;
}, string>;
