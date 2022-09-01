import { ChainId, Currency, CurrencyAmount, Token, TokenAmount } from 'dsgswap-sdk';
export declare function wrappedCurrency(currency: Currency | undefined, chainId: ChainId | undefined): Token | undefined;
export declare function wrappedCurrencyAmount(currencyAmount: CurrencyAmount | undefined, chainId: ChainId | undefined): TokenAmount | undefined;
export declare function unwrappedToken(token: Token): Currency;
