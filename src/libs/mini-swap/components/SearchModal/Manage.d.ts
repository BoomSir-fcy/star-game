/// <reference types="react" />
import { Token } from 'dsgswap-sdk';
import { TokenList } from '@uniswap/token-lists';
import { CurrencyModalView } from './types';
export default function Manage({ setModalView, setImportList, setImportToken, setListUrl, }: {
    setModalView: (view: CurrencyModalView) => void;
    setImportToken: (token: Token) => void;
    setImportList: (list: TokenList) => void;
    setListUrl: (url: string) => void;
}): JSX.Element;
