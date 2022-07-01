import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { getLanguageCodeFromLS } from 'contexts/Localization/helpers';
import { BIG_TEN, ONE_BILLION, ONE_MILLION } from 'config/constants/bigNumber';
import { SubString_1 } from './DecimalPlaces';

/**
 * Take a formatted amount, e.g. 15 BNB and convert it to full decimal value, e.g. 15000000000000000
 */
export const getDecimalAmount = (amount: BigNumber, decimals = 18) => {
  return new BigNumber(amount).times(BIG_TEN.pow(decimals));
};

export const getBalanceAmount = (amount: BigNumber, decimals = 18) => {
  return new BigNumber(amount).dividedBy(BIG_TEN.pow(decimals));
};

export const getValidDecimal = (validDecimal = 3, decimals = 18) => {
  return BIG_TEN.pow(decimals - validDecimal);
};

/**
 * This function is not really necessary but is used throughout the site.
 */
export const getBalanceNumber = (balance: BigNumber, decimals = 18) => {
  return getBalanceAmount(balance, decimals).toNumber();
};

export const getFullDisplayBalance = (
  balance: BigNumber,
  decimals = 18,
  displayDecimals = 0,
) => {
  return getBalanceAmount(balance, decimals).toFixed(displayDecimals);
};

export const formatNumber = (
  number: number,
  minPrecision = 2,
  maxPrecision = 2,
) => {
  const options = {
    minimumFractionDigits: minPrecision,
    maximumFractionDigits: maxPrecision,
  };
  return number.toLocaleString(undefined, options);
};

/**
 * Method to format the display of wei given an ethers.BigNumber object
 * Note: does NOT round
 */
export const formatBigNumber = (
  number: ethers.BigNumber,
  displayDecimals = 18,
  decimals = 18,
) => {
  const remainder = number.mod(
    ethers.BigNumber.from(10).pow(decimals - displayDecimals),
  );
  return formatUnits(number.sub(remainder), decimals);
};

/**
 * Method to format the display of wei given an ethers.BigNumber object with toFixed
 * Note: rounds
 */
export const formatBigNumberToFixed = (
  number: ethers.BigNumber,
  displayDecimals = 18,
  decimals = 18,
) => {
  const formattedString = formatUnits(number, decimals);
  return (+formattedString).toFixed(displayDecimals);
};

/**
 * Formats a FixedNumber like BigNumber
 * i.e. Formats 9763410526137450427.1196 into 9.763 (3 display decimals)
 */
export const formatFixedNumber = (
  number: ethers.FixedNumber,
  displayDecimals = 18,
  decimals = 18,
) => {
  // Remove decimal
  const [leftSide] = number.toString().split('.');
  return formatBigNumber(
    ethers.BigNumber.from(leftSide),
    displayDecimals,
    decimals,
  );
};

export const formatDisplayApr = (number: number, decimals = 6): string => {
  if (!Number.isFinite(number)) return '0';
  if (new BigNumber(number).isGreaterThanOrEqualTo(ONE_BILLION)) {
    const codeFromStorage = getLanguageCodeFromLS();
    return new Intl.NumberFormat(codeFromStorage, {
      notation: 'compact',
      // compactDisplay: 'long',
      maximumSignificantDigits: 6,
    }).format(Number(number?.toFixed(decimals)));
  }
  return number.toLocaleString('en-US', { maximumFractionDigits: decimals });
};

export const formatLocalisedCompactBalance = (
  number: number,
  decimals = 3,
): string => {
  if (!Number.isFinite(number)) return '0';
  if (new BigNumber(number).isGreaterThanOrEqualTo(ONE_MILLION)) {
    const codeFromStorage = getLanguageCodeFromLS();
    return new Intl.NumberFormat(codeFromStorage, {
      notation: 'compact',
      // compactDisplay: 'long',
      maximumSignificantDigits: 6,
    }).format(Number(number?.toFixed(decimals)));
  }
  return SubString_1(number, decimals);
};

export const formatLocalisedCompactNumber = (
  number: number,
  maximumSignificantDigits = 2,
): string => {
  const codeFromStorage = getLanguageCodeFromLS();
  return new Intl.NumberFormat(codeFromStorage, {
    notation: 'compact',
    // compactDisplay: 'long',
    maximumSignificantDigits,
  }).format(number);
};
/* eslint-disable */

// 千分号
export const splitThousandSeparator = (num: number): string => {
  let prefix: string = '';
  if (num < 0) {
    num *= -1;
    prefix = '-';
  }
  let DIGIT_PATTERN = /(^|\s)\d+(?=\.?\d*($|\s))/g;
  let MILI_PATTERN = /(?=(?!\b)(\d{3})+\.?\b)/g;
  let str: string = num
    .toString()
    .replace(DIGIT_PATTERN, m => m.replace(MILI_PATTERN, ','));
  return prefix + str;
};

// 余额显示精度
export const formatDisplayBalance = (
  stakedBalance: BigNumber,
  decimals = 18,
) => {
  const stakedBalanceBigNumber = getBalanceAmount(stakedBalance, decimals);
  if (stakedBalanceBigNumber.gt(0) && stakedBalanceBigNumber.lt(0.0000001)) {
    return stakedBalanceBigNumber.toFixed(10, BigNumber.ROUND_DOWN);
  }
  if (stakedBalanceBigNumber.gt(0) && stakedBalanceBigNumber.lt(0.001)) {
    return getFullDisplayBalance(stakedBalance, decimals).toLocaleString();
  }
  return stakedBalanceBigNumber.toFixed(3, BigNumber.ROUND_DOWN);
};

// 余额显示精度并和符合使用
export const formatDisplayBalanceWithSymbol = (
  stakedBalance: BigNumber,
  decimals = 18,
) => {
  const stakedBalanceBigNumber = getBalanceAmount(stakedBalance, decimals);
  if (stakedBalanceBigNumber.gt(0) && stakedBalanceBigNumber.lt(0.0_000_001)) {
    return '< 0.0000001';
  }
  if (stakedBalanceBigNumber.gt(0) && stakedBalanceBigNumber.lt(0.001)) {
    return getFullDisplayBalance(stakedBalance, decimals).toLocaleString();
  }
  if (stakedBalanceBigNumber.isGreaterThanOrEqualTo(ONE_BILLION)) {
    const codeFromStorage = getLanguageCodeFromLS();
    return new Intl.NumberFormat(codeFromStorage, {
      notation: 'compact',
      // compactDisplay: 'long',
      maximumSignificantDigits: 6,
    }).format(stakedBalanceBigNumber.toNumber());
  }
  return stakedBalanceBigNumber.toFixed(3, BigNumber.ROUND_DOWN);
};

export default formatLocalisedCompactNumber;
