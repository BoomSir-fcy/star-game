import { Address } from './types';
interface WarningToken {
    symbol: string;
    address: Address;
}
interface WarningTokenList {
    [key: string]: WarningToken;
}
declare const SwapWarningTokens: WarningTokenList;
export default SwapWarningTokens;
