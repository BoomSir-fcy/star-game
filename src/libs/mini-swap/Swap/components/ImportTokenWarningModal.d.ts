import React from 'react';
import { Token } from 'dsgswap-sdk';
import { InjectedModalProps } from 'pancake-uikit';
interface Props extends InjectedModalProps {
    tokens: Token[];
    onCancel: () => void;
}
declare const ImportTokenWarningModal: React.FC<Props>;
export default ImportTokenWarningModal;
