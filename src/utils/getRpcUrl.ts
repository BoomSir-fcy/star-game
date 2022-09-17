import sample from 'lodash/sample';
import { ChainId } from 'config/wallet/config';
import { ETHEREUM_CHAIN } from 'config/wallet/networks';

const { REACT_APP_CHAIN_ID } = process.env;

type chainId = keyof typeof ETHEREUM_CHAIN;

const ethereum =
  ETHEREUM_CHAIN[REACT_APP_CHAIN_ID as unknown as chainId] ||
  ETHEREUM_CHAIN[ChainId.MAINNET];

// Array of available nodes to connect to
export const nodes = [...ethereum.rpcUrls];

const getNodeUrl = () => {
  return sample(nodes) as string;
  // return 'https://data-seed-prebsc-1-s1.binance.org:8545/';
};

export default getNodeUrl;
