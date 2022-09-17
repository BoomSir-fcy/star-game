/// <reference types="react" />
import { Trade } from 'dsgswap-sdk';
export default function SwapModalHeader({ trade, allowedSlippage, recipient, showAcceptChanges, onAcceptChanges, }: {
    trade: Trade;
    allowedSlippage: number;
    recipient: string | null;
    showAcceptChanges: boolean;
    onAcceptChanges: () => void;
}): JSX.Element;
