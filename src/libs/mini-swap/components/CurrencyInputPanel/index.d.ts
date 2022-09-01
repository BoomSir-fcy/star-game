/// <reference types="react" />
import { Currency, Pair } from 'dsgswap-sdk';
interface CurrencyInputPanelProps {
    value: string;
    onUserInput: (value: string) => void;
    onMax?: () => void;
    showMaxButton: boolean;
    label?: string;
    onCurrencySelect?: (currency: Currency) => void;
    onSelect?: () => void;
    currency?: Currency | null;
    disableCurrencySelect?: boolean;
    hideBalance?: boolean;
    disabled?: boolean;
    pair?: Pair | null;
    hideInput?: boolean;
    otherCurrency?: Currency | null;
    id: string;
    showCommonBases?: boolean;
}
export default function CurrencyInputPanel({ value, onUserInput, onMax, showMaxButton, label, onCurrencySelect, currency, disableCurrencySelect, hideBalance, disabled, pair, // used for double token logo
hideInput, otherCurrency, id, onSelect, showCommonBases, }: CurrencyInputPanelProps): JSX.Element;
export {};
