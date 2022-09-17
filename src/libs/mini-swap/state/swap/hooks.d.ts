import { Currency, CurrencyAmount, Token, Trade } from 'dsgswap-sdk';
import { ParsedQs } from 'qs';
import { PairState } from 'hooks/usePairs';
import { AppState } from '../index';
import { Field } from './actions';
import { SwapState } from './reducer';
import { PolyDataIndexStatus, PolyDataIndex } from '../types';
export declare function useSwapState(): AppState['swap'];
export declare function useSwapActionHandlers(): {
    onCurrencySelection: (field: Field, currency: Currency) => void;
    onSwitchTokens: () => void;
    onUserInput: (field: Field, typedValue: string) => void;
    onChangeRecipient: (recipient: string | null) => void;
};
export declare function tryParseAmount(value?: string, currency?: Currency): CurrencyAmount | undefined;
export declare function useCheckUpdatePolyIndex(): [PolyDataIndexStatus, PolyDataIndex];
export declare function useDerivedSwapInfo(): {
    currencies: {
        [field in Field]?: Currency;
    };
    currencyBalances: {
        [field in Field]?: CurrencyAmount;
    };
    parsedAmount: CurrencyAmount | undefined;
    v2Trade: Trade | undefined;
    inputError?: string;
    pairState?: PairState;
};
export declare function queryParametersToSwapState(parsedQs: ParsedQs): SwapState;
export declare function useDefaultsFromURLSearch(outputCurrency?: string, inputCurrency?: string): {
    inputCurrencyId: string | undefined;
    outputCurrencyId: string | undefined;
} | undefined;
export declare function useSwapCurrencies(): {
    inputCurrency: Currency | Token;
    outputCurrency: Currency | Token;
};
