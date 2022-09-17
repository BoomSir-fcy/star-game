import { ChainId } from 'dsgswap-sdk';
import MULTICALL_ABI from '../../abi/Multicall.json';
declare const MULTICALL_NETWORKS: {
    [chainId in ChainId]: string;
};
export { MULTICALL_ABI, MULTICALL_NETWORKS };
