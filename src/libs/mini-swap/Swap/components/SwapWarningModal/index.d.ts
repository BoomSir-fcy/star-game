import React from 'react';
import { WrappedTokenInfo } from 'state/lists/hooks';
interface SwapWarningModalProps {
    swapCurrency: WrappedTokenInfo;
    onDismiss?: () => void;
}
declare const SwapWarningModal: React.FC<SwapWarningModalProps>;
export default SwapWarningModal;
