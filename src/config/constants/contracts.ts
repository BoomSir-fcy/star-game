import isApp2, { IS_PUBLIC_BETA } from 'config/AppDevelopment';
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
    [ChainId.BSC_TESTNET]: '0x3ae6c786e5198c11Af43C257790a57a3D35Bf435',
  },
  MysteryBox: {
    [ChainId.BSC_MAINNET]: '',
    [ChainId.BSC_TESTNET]: '0xCA8496eE9d30FA508cbe039381A7A185F716B7C5',
  },
  Galaxy: {
    [ChainId.BSC_MAINNET]: '',
    [ChainId.BSC_TESTNET]: '0x9bf20baFEFA712DC4FBC7c78c827CFE92D212044',
  },
  Planet: {
    [ChainId.BSC_MAINNET]: '',
    [ChainId.BSC_TESTNET]: '0x25DE1D8d993Bd60a77E13479162B267b4Ee49fd1',
  },
  UserVault: {
    [ChainId.BSC_MAINNET]: '',
    [ChainId.BSC_TESTNET]: '0x3f32e1FD8170911c52D3a664E9dD41e9efa80038',
  },
  BoxToken: {
    [ChainId.BSC_MAINNET]: '',
    [ChainId.BSC_TESTNET]: '0xf259DEec42ef3C579Ab189D2aa6986a671335691',
  },
  EnergyToken: {
    [ChainId.BSC_MAINNET]: '',
    [ChainId.BSC_TESTNET]: '0x7392365a78405534920a7AdAEd5640290A550b16',
  },
  SpiceToken: {
    [ChainId.BSC_MAINNET]: '',
    [ChainId.BSC_TESTNET]: '0x7A39FD7605C16f3e0Dc106CA05c772Ca3aB5e11A',
  },
  OreToken: {
    [ChainId.BSC_MAINNET]: '',
    [ChainId.BSC_TESTNET]: '0xB7A7AE871d40d1bd45b071e9568D0070cA31C3db',
  },
  GetCoinTest: {
    [ChainId.BSC_MAINNET]: '',
    [ChainId.BSC_TESTNET]: '0x243AfD5010498f91288F1AF749988aF20F88827a',
  },
  stkbnb: {
    [ChainId.BSC_MAINNET]: '',
    [ChainId.BSC_TESTNET]: '0xF7CE8444b3b1c62e785a25343a8B4764198A81B8',
  },
};

const contracts2 = {
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
    [ChainId.BSC_TESTNET]: '0xD4B6307e22aa517D46Ca2BD79A8960Bb7Dd982a0',
  },
  MysteryBox: {
    [ChainId.BSC_MAINNET]: '',
    [ChainId.BSC_TESTNET]: '0xE927F29B56a7ea046eB4f297bCde197E22112570',
  },
  Galaxy: {
    [ChainId.BSC_MAINNET]: '',
    [ChainId.BSC_TESTNET]: '0x8C9d948e51FF6238B517b08587C21caBAE3b1703',
  },
  Planet: {
    [ChainId.BSC_MAINNET]: '',
    [ChainId.BSC_TESTNET]: '0x001323D72D2ff0C8f7D7FB30c66d4580D19E1ED6',
  },
  UserVault: {
    [ChainId.BSC_MAINNET]: '',
    [ChainId.BSC_TESTNET]: '0xb29C0cCFEF069521122FD4Fa40Db56A360CBb215',
  },
  BoxToken: {
    [ChainId.BSC_MAINNET]: '',
    [ChainId.BSC_TESTNET]: '0x886d8FD11B3053d1b0F32bb61D21483Cd1038883',
  },
  EnergyToken: {
    [ChainId.BSC_MAINNET]: '',
    [ChainId.BSC_TESTNET]: '0xFa272c7c55496c626681A88eeF6E60290166EFCC',
  },
  SpiceToken: {
    [ChainId.BSC_MAINNET]: '',
    [ChainId.BSC_TESTNET]: '0x9129F523897c13da7e1AAFB676FF0F03D9058887',
  },
  OreToken: {
    [ChainId.BSC_MAINNET]: '',
    [ChainId.BSC_TESTNET]: '0xe89ab44dDd38C054e8F527086f701D0F210531cB',
  },
  GetCoinTest: {
    [ChainId.BSC_MAINNET]: '',
    [ChainId.BSC_TESTNET]: '0xb9FE7C70a405037C730e31727231623Ab351a0D5',
  },
  stkbnb: {
    [ChainId.BSC_MAINNET]: '',
    [ChainId.BSC_TESTNET]: '0xF7CE8444b3b1c62e785a25343a8B4764198A81B8',
  },
};
const contractsBeta = {
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
    [ChainId.BSC_TESTNET]: '0xee27a4e0216acece9abb376a595a39ee9efaabd8',
  },
  MysteryBox: {
    [ChainId.BSC_MAINNET]: '',
    [ChainId.BSC_TESTNET]: '0x7597c690e0782f90b12d6310d0acf05233cd82d2',
  },
  Galaxy: {
    [ChainId.BSC_MAINNET]: '',
    [ChainId.BSC_TESTNET]: '0x8e1e268185cf840d9829bd39cce8b3691f44d372',
  },
  Planet: {
    [ChainId.BSC_MAINNET]: '',
    [ChainId.BSC_TESTNET]: '0xd06108956f3ebd1ba395808a3c6fc304f0911d0a',
  },
  UserVault: {
    [ChainId.BSC_MAINNET]: '',
    [ChainId.BSC_TESTNET]: '0x7428b7e7c8089d7c92e1f2146df7663b9a9b2dc7',
  },
  BoxToken: {
    [ChainId.BSC_MAINNET]: '',
    [ChainId.BSC_TESTNET]: '0x84a253841bdecc75a0cdf3378c507a38a2b88e2a',
  },
  EnergyToken: {
    [ChainId.BSC_MAINNET]: '',
    [ChainId.BSC_TESTNET]: '0xb683ed223765f2a2c668535fe31d23020e66155c',
  },
  SpiceToken: {
    [ChainId.BSC_MAINNET]: '',
    [ChainId.BSC_TESTNET]: '0x3fe8f999425c3d3655b79d915ab0de6869143afd',
  },
  OreToken: {
    [ChainId.BSC_MAINNET]: '',
    [ChainId.BSC_TESTNET]: '0x0ae0e86465483d2908519d0563d40dd429f66e1d',
  },
  GetCoinTest: {
    [ChainId.BSC_MAINNET]: '',
    [ChainId.BSC_TESTNET]: '0xb9FE7C70a405037C730e31727231623Ab351a0D5',
  },
  stkbnb: {
    [ChainId.BSC_MAINNET]: '',
    [ChainId.BSC_TESTNET]: '0xF7CE8444b3b1c62e785a25343a8B4764198A81B8',
  },
};

export default IS_PUBLIC_BETA ? contractsBeta : isApp2 ? contracts2 : contracts;
