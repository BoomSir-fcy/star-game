import { MutableRefObject } from 'react';
import { Currency, Token } from 'dsgswap-sdk';
import { FixedSizeList } from 'react-window';
export default function CurrencyList({ height, currencies, selectedCurrency, onCurrencySelect, otherCurrency, fixedListRef, showETH, showImportView, setImportToken, breakIndex, }: {
    height: number;
    currencies: Currency[];
    selectedCurrency?: Currency | null;
    onCurrencySelect: (currency: Currency) => void;
    otherCurrency?: Currency | null;
    fixedListRef?: MutableRefObject<FixedSizeList | undefined>;
    showETH: boolean;
    showImportView: () => void;
    setImportToken: (token: Token) => void;
    breakIndex: number | undefined;
}): JSX.Element;
