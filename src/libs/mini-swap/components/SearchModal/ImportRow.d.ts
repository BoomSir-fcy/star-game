import { CSSProperties } from 'react';
import { Token } from 'dsgswap-sdk';
export default function ImportRow({ token, style, dim, showImportView, setImportToken, }: {
    token: Token;
    style?: CSSProperties;
    dim?: boolean;
    showImportView: () => void;
    setImportToken: (token: Token) => void;
}): JSX.Element;
