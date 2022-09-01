import React from 'react';
interface HandleInputProps {
    max?: number;
    value: string;
    onChange: (value: string) => void;
}
declare const HandleInput: React.FC<HandleInputProps>;
export default HandleInput;
