import { ChainId } from '../wallet/config';

const contracts = {
  test: {
    [ChainId.BSC_MAINNET]: '0x675e77aeb7F50CAbCE65B9d7114aeB402557679f',
    [ChainId.BSC_TESTNET]: '0x675e77aeb7F50CAbCE65B9d7114aeB402557679f',
  },
  multiCall: {
    [ChainId.BSC_MAINNET]: '0xfF6FD90A470Aaa0c1B8A54681746b07AcdFedc9B',
    [ChainId.BSC_MAINNET]: '0x8F3273Fb89B075b1645095ABaC6ed17B2d4Bc576',
  },
};
export default contracts;
