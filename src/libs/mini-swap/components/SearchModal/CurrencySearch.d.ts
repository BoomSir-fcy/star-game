/// <reference types="react" />
import { Currency, Token } from 'dsgswap-sdk';
interface CurrencySearchProps {
    selectedCurrency?: Currency | null;
    onCurrencySelect: (currency: Currency) => void;
    otherSelectedCurrency?: Currency | null;
    showCommonBases?: boolean;
    showImportView: () => void;
    setImportToken: (token: Token) => void;
}
declare function CurrencySearch({ selectedCurrency, onCurrencySelect, otherSelectedCurrency, showCommonBases, showImportView, setImportToken, }: CurrencySearchProps): JSX.Element;
export default CurrencySearch;
