import { Web3Provider } from '@ethersproject/providers';
import { Web3ReactContextInterface } from '@web3-react/core/dist/types';
/**
 * Provides a web3 provider with or without user's signer
 * Recreate web3 instance only if the provider change
 */
declare const useActiveWeb3React: () => Web3ReactContextInterface<Web3Provider>;
export default useActiveWeb3React;
