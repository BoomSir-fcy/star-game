import React from 'react';
import { Trade } from 'dsgswap-sdk';
import { InjectedModalProps } from 'pancake-uikit';
interface ConfirmSwapModalProps {
    trade?: Trade;
    originalTrade?: Trade;
    attemptingTxn: boolean;
    txHash?: string;
    recipient: string | null;
    allowedSlippage: number;
    onAcceptChanges: () => void;
    onConfirm: () => void;
    swapErrorMessage?: string;
    customOnDismiss?: () => void;
}
declare const ConfirmSwapModal: React.FC<InjectedModalProps & ConfirmSwapModalProps>;
export default ConfirmSwapModal;
