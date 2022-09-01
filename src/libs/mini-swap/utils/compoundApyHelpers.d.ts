/**
 *
 * @param principalInUSD - amount user wants to invest in USD
 * @param apr - farm or pool apr as percentage. If its farm APR its only cake rewards APR without LP rewards APR
 * @param earningTokenPrice - price of reward token
 * @param compoundFrequency - how many compounds per 1 day, e.g. 1 = one per day, 0.142857142 - once per week
 * @param performanceFee - performance fee as percentage
 * @returns an array of token values earned as interest, with each element representing interest earned over a different period of time (DAYS_TO_CALCULATE_AGAINST)
 */
export declare const getInterestBreakdown: ({ principalInUSD, apr, earningTokenPrice, compoundFrequency, performanceFee, }: {
    principalInUSD: number;
    apr: number;
    earningTokenPrice: number;
    compoundFrequency?: number;
    performanceFee?: number;
}) => number[];
/**
 * @param interest how much USD amount you aim to make
 * @param apr APR of farm/pool
 * @param compoundingFrequency how many compounds per 1 day, e.g. 1 = one per day, 0.142857142 - once per week
 * @returns an array of principal values needed to reach target interest, with each element representing principal needed for a different period of time (DAYS_TO_CALCULATE_AGAINST)
 */
export declare const getPrincipalForInterest: (interest: number, apr: number, compoundingFrequency: number, performanceFee?: number) => number[];
/**
 * Given APR returns APY
 * @param apr APR as percentage
 * @param compoundFrequency how many compounds per day
 * @param days if other than 365 adjusts (A)PY for period less than a year
 * @param performanceFee performance fee as percentage
 * @returns APY as decimal
 */
export declare const getApy: (apr: number, compoundFrequency?: number, days?: number, performanceFee?: number) => number;
export declare const getRoi: ({ amountEarned, amountInvested }: {
    amountEarned: number;
    amountInvested: number;
}) => number;
