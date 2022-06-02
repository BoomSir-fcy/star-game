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
  DsgToken: {
    [ChainId.BSC_MAINNET]: '0x9A78649501BbAAC285Ea4187299471B7ad4ABD35',
    [ChainId.BSC_TESTNET]: '0xf8e8c2e77c47B9da858477341a649823f500c295',
  },
  TimeToken: {
    [ChainId.BSC_MAINNET]: '0xc7184a87D9443A52F6E578E3C0A611468536487f',
    [ChainId.BSC_TESTNET]: '0xd3a03c02e3DFf87a1C42eb33705440471E4F0d63',
  },
  MatterToken: {
    [ChainId.BSC_MAINNET]: '0x6Da59176FBc92f227853E17202B62D79B82f6a40',
    [ChainId.BSC_TESTNET]: '0xAd47428ed49926D5769DaCCdA27C03F1A47cEf91',
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
  BoxToken: {
    [ChainId.BSC_MAINNET]: '',
    [ChainId.BSC_TESTNET]: '0x2bf6502a30Af3378ACb51F056F47fc5e24aB8961',
  },
  EnergyToken: {
    [ChainId.BSC_MAINNET]: '',
    [ChainId.BSC_TESTNET]: '0xf7562ba09a99635f1420df0652ec23aad2b8b718',
  },
  PopToken: {
    [ChainId.BSC_MAINNET]: '',
    [ChainId.BSC_TESTNET]: '0xe0b773b980ec1de9d097b577124b35396aca532b',
  },
  OreToken: {
    [ChainId.BSC_MAINNET]: '',
    [ChainId.BSC_TESTNET]: '0xcc1454d0e42c47e80baa532c08f81be3e136c6ea',
  },
};
export default contracts;
