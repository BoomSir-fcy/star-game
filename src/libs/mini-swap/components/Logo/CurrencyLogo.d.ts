import { Currency } from 'dsgswap-sdk';
import React from 'react';
export default function CurrencyLogo({ currency, size, style, symbol, }: {
    currency?: Currency;
    symbol?: string;
    size?: string;
    style?: React.CSSProperties;
}): JSX.Element;
