import { ThunkAction } from 'redux-thunk';
import { AnyAction } from '@reduxjs/toolkit';
import { Token } from 'config/constants/types';
import { Price, CurrencyAmount, TokenAmount } from 'dsgswap-sdk';
export declare type AppThunk<ReturnType = void> = ThunkAction<ReturnType, State, unknown, AnyAction>;
export interface BigNumberToJson {
    type: 'BigNumber';
    hex: string;
}
export declare type TranslatableText = string | {
    key: string;
    data?: {
        [key: string]: string | number;
    };
};
export declare type SerializedBigNumber = string;
export interface BlockState {
    currentBlock: number;
    initialBlock: number;
}
export interface swapDayData {
    id: string;
    date: number;
    totalLiquidityUSD: string;
    totalVolumeUSD: string;
}
export interface DsgTotalData {
    reserveUSD: string;
    totalVolumeUSD: string;
    loaded?: boolean;
}
export interface PolyData {
    fromToken: {
        symbol: string;
        name: string;
        address: string;
        decimals: number;
        logoURI: string;
    };
    toToken: {
        symbol: string;
        name: string;
        address: string;
        decimals: number;
        logoURI: string;
    };
    toTokenAmount: string;
    fromTokenAmount: string;
    protocols: [
        [
            [
                {
                    name: string;
                    part: number;
                    fromTokenAddress: string;
                    toTokenAddress: string;
                }
            ],
            [
                {
                    name: string;
                    part: number;
                    fromTokenAddress: string;
                    toTokenAddress: string;
                }
            ],
            [
                {
                    name: string;
                    part: number;
                    fromTokenAddress: string;
                    toTokenAddress: string;
                }
            ]
        ]
    ];
    price: Price;
    estimatedGas: number;
    isPolyMethed: boolean;
    currencyAmount: CurrencyAmount;
    toCurrencyAmount: CurrencyAmount;
    fromCurrencyTokenAmount?: TokenAmount;
    fromCurrencyToken?: Token;
}
export interface PolyDataIndex {
    lastQueryTimestamp?: number;
    fromTokenAddress?: string;
    toTokenAddress?: string;
    amount?: string;
    slippage?: number;
    fromAddress?: string;
    amountDecimal?: string;
}
export interface PolyApproveData {
    data: string;
    gasPrice: string;
    to: string;
    value: string;
}
export interface PolyAllowance {
    [address: string]: string;
}
export interface PolySwapState {
    polyData?: PolyData;
    polyDataIndex?: PolyDataIndex;
    polyApproveData?: PolyApproveData;
    polyAllowance?: PolyAllowance;
    polySpender?: string;
}
export declare enum PolyDataIndexStatus {
    NOT_SWAP_DATA = 0,
    NEED_QUERY = 1,
    NEED_REFRESH = 2,
    LOADED = 3
}
export interface State {
    block: BlockState;
}
