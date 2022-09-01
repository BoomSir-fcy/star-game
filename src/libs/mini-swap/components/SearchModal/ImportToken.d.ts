/// <reference types="react" />
import { Token, Currency } from 'dsgswap-sdk';
interface ImportProps {
    tokens: Token[];
    handleCurrencySelect?: (currency: Currency) => void;
}
declare function ImportToken({ tokens, handleCurrencySelect }: ImportProps): JSX.Element;
export default ImportToken;
