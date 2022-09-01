/// <reference types="react" />
import { Token } from 'dsgswap-sdk';
import { CurrencyModalView } from './types';
export default function ManageTokens({ setModalView, setImportToken, }: {
    setModalView: (view: CurrencyModalView) => void;
    setImportToken: (token: Token) => void;
}): JSX.Element;
