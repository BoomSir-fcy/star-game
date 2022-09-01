import BigNumber from 'bignumber.js';
/**
 * Get the APR value in %
 * @param stakingTokenPrice Token price in the same quote currency
 * @param rewardTokenPrice Token price in the same quote currency
 * @param totalStaked Total amount of stakingToken in the pool
 * @param tokenPerBlock Amount of new cake allocated to the pool for each new block
 * @returns Null if the APR is NaN or infinite.
 */
export declare const getPoolApr: (stakingTokenPrice: number, rewardTokenPrice: number, totalStaked: number, tokenPerBlock: number) => number;
/**
 * Get Trading APR value in %
 * @param stakingTokenPrice Token price in the same quote currency
 * @param rewardTokenPrice Token price in the same quote currency
 * @param totalStaked Total amount of stakingToken in the pool
 * @param tokenPerBlock Amount of new cake allocated to the pool for each new block
 * @returns Null if the APR is NaN or infinite.
 */
export declare const getTradingApr: (stakingTokenPrice: BigNumber, rewardTokenPrice: BigNumber, tokenPerBlock: BigNumber, decimals?: number) => string;
/**
 * Get farm APR value in %
 * @param poolWeight allocationPoint / totalAllocationPoint
 * @param cakePriceUsd Cake price in USD
 * @param poolLiquidityUsd Total pool liquidity in USD
 * @returns
 */
export declare const getFarmApr: (fourRealAmount: BigNumber, cakePriceUsd: BigNumber, rewardsPerBlock: BigNumber, poolLiquidityUsd: BigNumber, farmAddress: string) => {
    cakeRewardsApr: number;
    lpRewardsApr: number;
};
/**
 * Get single pool APR value in %
 * @param poolWeight allocationPoint / totalAllocationPoint
 * @param cakePriceUsd Cake price in USD
 * @param poolLiquidityUsd Total pool liquidity in USD
 * @returns
 */
export declare const getSinglePoolApr: (rewardsTokenPrice: BigNumber, rewardsPerBlock: BigNumber, poolLiquidityUsd: BigNumber) => {
    cakeRewardsApr: number;
};
export declare const getNftFarmApr: (cakePriceUsd: BigNumber, rewardsPerBlock: BigNumber, poolTotalPowers: BigNumber) => number;
export declare const getMemberBaseApr: (dsgPerBlock: BigNumber, stakedDsg: BigNumber) => number;
export declare const getMemberDonaApr: (donateAmount3: BigNumber, donateDt: number, stakedDsg: BigNumber) => number;
export declare const getMemberFeeApr: (feeAmount3: BigNumber, feeDt: number, stakedDsg: BigNumber) => number;
export declare const getMemberTotalApr: (baseAPY: number, donateAPY: number, feeAPY: number) => number;
declare const _default: any;
export default _default;
