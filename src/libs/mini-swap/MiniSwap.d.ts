import React from 'react';
import { Currency, Token } from 'dsgswap-sdk';
import { SwapInterface } from './Swap';
import { ProvidersPorps } from './Providers';
interface ListenerCurrencyChangeProps {
    onInputCurrencyChange?: (currency: Currency | Token) => void;
    onOutputCurrencyChange?: (currency: Currency | Token) => void;
}
interface MiniSwapInterface extends ProvidersPorps, SwapInterface, ListenerCurrencyChangeProps {
    onConnectWallet?: () => void;
    onLoaded?: () => void;
}
declare const MiniSwap: React.FC<MiniSwapInterface>;
export default MiniSwap;
