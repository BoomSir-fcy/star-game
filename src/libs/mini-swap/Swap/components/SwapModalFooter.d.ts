/// <reference types="react" />
import { Trade } from 'dsgswap-sdk';
export default function SwapModalFooter({ trade, onConfirm, allowedSlippage, swapErrorMessage, disabledConfirm, }: {
    trade: Trade;
    allowedSlippage: number;
    onConfirm: () => void;
    swapErrorMessage: string | undefined;
    disabledConfirm: boolean;
}): JSX.Element;
