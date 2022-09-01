/// <reference types="react" />
import { Currency } from 'dsgswap-sdk';
import { InjectedModalProps } from 'pancake-uikit';
interface CurrencySearchModalProps extends InjectedModalProps {
    selectedCurrency?: Currency | null;
    onCurrencySelect: (currency: Currency) => void;
    otherSelectedCurrency?: Currency | null;
    showCommonBases?: boolean;
}
export default function CurrencySearchModal({ onDismiss, onCurrencySelect, selectedCurrency, otherSelectedCurrency, showCommonBases, }: CurrencySearchModalProps): JSX.Element;
export {};
