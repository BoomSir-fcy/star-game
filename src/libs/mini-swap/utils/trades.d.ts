import { Trade, Percent } from 'dsgswap-sdk';
export declare function isTradeBetter(tradeA: Trade | undefined | null, tradeB: Trade | undefined | null, minimumDelta?: Percent): boolean | undefined;
export default isTradeBetter;
