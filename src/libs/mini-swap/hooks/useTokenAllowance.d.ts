import { Token, TokenAmount } from 'dsgswap-sdk';
declare function useTokenAllowance(token?: Token, owner?: string, spender?: string): TokenAmount | undefined;
export default useTokenAllowance;
