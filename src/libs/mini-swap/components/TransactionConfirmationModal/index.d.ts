import React from 'react';
import { Currency } from 'dsgswap-sdk';
import { InjectedModalProps } from 'pancake-uikit';
export declare function ConfirmationModalContent({ bottomContent, topContent, }: {
    topContent: () => React.ReactNode;
    bottomContent: () => React.ReactNode;
}): JSX.Element;
export declare function TransactionErrorContent({ message, onDismiss }: {
    message: string;
    onDismiss: () => void;
}): JSX.Element;
interface ConfirmationModalProps {
    title: string;
    customOnDismiss?: () => void;
    hash: string | undefined;
    content: () => React.ReactNode;
    attemptingTxn: boolean;
    pendingText: string;
    currencyToAdd?: Currency | undefined;
}
declare const TransactionConfirmationModal: React.FC<InjectedModalProps & ConfirmationModalProps>;
export default TransactionConfirmationModal;
