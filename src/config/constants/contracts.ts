import { ChainId } from '../wallet/config';

const contracts = {
  test: {
    [ChainId.BSC_MAINNET]: '0x675e77aeb7F50CAbCE65B9d7114aeB402557679f',
    [ChainId.BSC_TESTNET]: '0x675e77aeb7F50CAbCE65B9d7114aeB402557679f',
  },
  multiCall: {
    [ChainId.BSC_MAINNET]: '0xfF6FD90A470Aaa0c1B8A54681746b07AcdFedc9B',
    [ChainId.BSC_TESTNET]: '0x8F3273Fb89B075b1645095ABaC6ed17B2d4Bc576',
  },
  WBNB: {
    [ChainId.BSC_MAINNET]: '0xfF6FD90A470Aaa0c1B8A54681746b07AcdFedc9B',
    [ChainId.BSC_TESTNET]: '0x8F3273Fb89B075b1645095ABaC6ed17B2d4Bc576',
  },
  UserAgent: {
    [ChainId.BSC_MAINNET]: '',
    [ChainId.BSC_TESTNET]: '0x380F9e3F556e1F568e66aF16EAe49dF38313Fb57',
  },
  MysteryBox: {
    [ChainId.BSC_MAINNET]: '',
    [ChainId.BSC_TESTNET]: '0xa9da2bFea47D45F0fe1809ea760CBd956EeC58cC',
  },
  Galaxy: {
    [ChainId.BSC_MAINNET]: '',
    [ChainId.BSC_TESTNET]: '0x29b4b2e169EFA9ABF5C90E012D81694FB2D5D7e4',
  },
  Planet: {
    [ChainId.BSC_MAINNET]: '',
    [ChainId.BSC_TESTNET]: '0x59F71c8a1082EE1329486464206330f307565089',
  },
  UserVault: {
    [ChainId.BSC_MAINNET]: '',
    [ChainId.BSC_TESTNET]: '0xb4980C5121dce73BC7E554ffe6ab6262598774CC',
  },
};
export default contracts;
