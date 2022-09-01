/// <reference types="react" />
import { ChainId, Currency } from 'dsgswap-sdk';
export default function CommonBases({ chainId, onSelect, selectedCurrency, }: {
    chainId?: ChainId;
    selectedCurrency?: Currency | null;
    onSelect: (currency: Currency) => void;
}): JSX.Element;
