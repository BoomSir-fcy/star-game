import { Currency, CurrencyAmount, Pair, Percent, TokenAmount } from 'dsgswap-sdk';
import { AppState } from '../index';
import { Field } from './actions';
export declare function useBurnState(): AppState['burn'];
export declare function useDerivedBurnInfo(currencyA: Currency | undefined, currencyB: Currency | undefined): {
    pair?: Pair | null;
    parsedAmounts: {
        [Field.LIQUIDITY_PERCENT]: Percent;
        [Field.LIQUIDITY]?: TokenAmount;
        [Field.CURRENCY_A]?: CurrencyAmount;
        [Field.CURRENCY_B]?: CurrencyAmount;
    };
    error?: string;
};
export declare function useBurnActionHandlers(): {
    onUserInput: (field: Field, typedValue: string) => void;
};
