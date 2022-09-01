import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
/**
 * Take a formatted amount, e.g. 15 BNB and convert it to full decimal value, e.g. 15000000000000000
 */
export declare const getDecimalAmount: (amount: BigNumber, decimals?: number) => BigNumber;
export declare const getBalanceAmount: (amount: BigNumber, decimals?: number) => BigNumber;
export declare const getValidDecimal: (validDecimal?: number, decimals?: number) => BigNumber;
/**
 * This function is not really necessary but is used throughout the site.
 */
export declare const getBalanceNumber: (balance: BigNumber, decimals?: number) => number;
export declare const getFullDisplayBalance: (balance: BigNumber, decimals?: number, displayDecimals?: number) => string;
export declare const formatNumber: (number: number, minPrecision?: number, maxPrecision?: number) => string;
/**
 * Method to format the display of wei given an ethers.BigNumber object
 * Note: does NOT round
 */
export declare const formatBigNumber: (number: ethers.BigNumber, displayDecimals?: number, decimals?: number) => string;
/**
 * Method to format the display of wei given an ethers.BigNumber object with toFixed
 * Note: rounds
 */
export declare const formatBigNumberToFixed: (number: ethers.BigNumber, displayDecimals?: number, decimals?: number) => string;
/**
 * Formats a FixedNumber like BigNumber
 * i.e. Formats 9763410526137450427.1196 into 9.763 (3 display decimals)
 */
export declare const formatFixedNumber: (number: ethers.FixedNumber, displayDecimals?: number, decimals?: number) => string;
export declare const formatDisplayApr: (number: number) => string;
export declare const formatLocalisedCompactNumber: (number: number, maximumSignificantDigits?: number) => string;
export declare const formatDisplayBalance: (stakedBalance: BigNumber, decimals?: number) => string;
export default formatLocalisedCompactNumber;
