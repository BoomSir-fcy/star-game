import { CurrencyAmount } from 'dsgswap-sdk';
/**
 * Given some token amount, return the max that can be spent of it
 * @param currencyAmount to return max of
 */
export declare function maxAmountSpend(currencyAmount?: CurrencyAmount): CurrencyAmount | undefined;
export default maxAmountSpend;
