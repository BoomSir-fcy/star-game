import isApp2 from 'config/AppDevelopment';
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
  PopToken: {
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
    [ChainId.BSC_TESTNET]: '0x0314323bAB6620B75F01DA7Af6f2CEdeBA8BCFe3',
  },
  MysteryBox: {
    [ChainId.BSC_MAINNET]: '',
    [ChainId.BSC_TESTNET]: '0x77AaaFCDde1b1acEC55310814F0D3Ed12c6dbB66',
  },
  Galaxy: {
    [ChainId.BSC_MAINNET]: '',
    [ChainId.BSC_TESTNET]: '0x74FeCBf2bAd002fAA4F724A7Bd16A623b78f578B',
  },
  Planet: {
    [ChainId.BSC_MAINNET]: '',
    [ChainId.BSC_TESTNET]: '0x5E22EedCEbd9FaFeB3DFf128987e53D284e12f13',
  },
  UserVault: {
    [ChainId.BSC_MAINNET]: '',
    [ChainId.BSC_TESTNET]: '0x695A3CF2f68c945131921fD0064aE524be77c133',
  },
  BoxToken: {
    [ChainId.BSC_MAINNET]: '',
    [ChainId.BSC_TESTNET]: '0x7f3EaDa6e9Da0734e4a8213475Be7848c0b0e8cb',
  },
  EnergyToken: {
    [ChainId.BSC_MAINNET]: '',
    [ChainId.BSC_TESTNET]: '0x3932a5E4827c7550074c2a63d674f80eF5bC74E6',
  },
  PopToken: {
    [ChainId.BSC_MAINNET]: '',
    [ChainId.BSC_TESTNET]: '0x243E5f1F61fbdCFcAA314c681e871E6FA09b852e',
  },
  OreToken: {
    [ChainId.BSC_MAINNET]: '',
    [ChainId.BSC_TESTNET]: '0x43368c6681E1352ad59EB629EC8910bA78987b07',
  },
  GetCoinTest: {
    [ChainId.BSC_MAINNET]: '',
    [ChainId.BSC_TESTNET]: '0x527E3b4b3E874666d6daBF72b202caEcC9dC9010',
  },
};

export default isApp2 ? contracts2 : contracts;
