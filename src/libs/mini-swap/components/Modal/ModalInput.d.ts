import React from 'react';
interface ModalInputProps {
    max?: string;
    symbol: string;
    onSelectMax?: () => void;
    onChange: (e: React.FormEvent<HTMLInputElement>) => void;
    placeholder?: string;
    value: string;
    addLiquidityUrl?: string;
    inputTitle?: string;
    hideMax?: boolean;
    decimals?: number;
    readOnly?: boolean;
}
declare const ModalInput: React.FC<ModalInputProps>;
export default ModalInput;
