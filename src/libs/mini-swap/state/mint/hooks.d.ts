import { Currency, CurrencyAmount, Pair, Percent, Price, TokenAmount } from 'dsgswap-sdk';
import { PairState } from 'hooks/usePairs';
import { AppState } from '../index';
import { Field } from './actions';
export declare function useMintState(): AppState['mint'];
export declare function useMintActionHandlers(noLiquidity: boolean | undefined): {
    onFieldAInput: (typedValue: string) => void;
    onFieldBInput: (typedValue: string) => void;
};
export declare function useDerivedMintInfo(currencyA: Currency | undefined, currencyB: Currency | undefined): {
    dependentField: Field;
    currencies: {
        [field in Field]?: Currency;
    };
    pair?: Pair | null;
    pairState: PairState;
    currencyBalances: {
        [field in Field]?: CurrencyAmount;
    };
    parsedAmounts: {
        [field in Field]?: CurrencyAmount;
    };
    price?: Price;
    noLiquidity?: boolean;
    liquidityMinted?: TokenAmount;
    poolTokenPercentage?: Percent;
    error?: string;
};
