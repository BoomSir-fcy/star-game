import { ChainId } from './config';

export const contractAddress = {
  masterChef: {
    [ChainId.MATIC_TESTNET]: '0x675e77aeb7F50CAbCE65B9d7114aeB402557679f',
    [ChainId.MATIC_MAINNET]: '0x675e77aeb7F50CAbCE65B9d7114aeB402557679f',
    [ChainId.MAINNET]: '0x675e77aeb7F50CAbCE65B9d7114aeB402557679f',
  },
  sousChef: {
    [ChainId.MATIC_TESTNET]: '0xd3af5fe61dbaf8f73149bfcfa9fb653ff096029a',
    [ChainId.MATIC_MAINNET]: '0xd3af5fe61dbaf8f73149bfcfa9fb653ff096029a',
    [ChainId.MAINNET]: '0x6ab8463a4185b80905e05a9ff80a2d6b714b9e95',
  },
  multiCall: {
    [ChainId.MATIC_TESTNET]: '0x29723121199A25C446A36e5E8D0A7dcF1ac5291B',
    [ChainId.MAINNET]: '0x29723121199A25C446A36e5E8D0A7dcF1ac5291B',
    [ChainId.MATIC_MAINNET]: '0x61B23B08cBf3331a32e1DcB036bABc6b36555D76',
  },
  cakeVault: {
    [ChainId.MATIC_TESTNET]: '0xa80240Eb5d7E05d3F250cF000eEc0891d00b51CC',
    [ChainId.MAINNET]: '0xa80240Eb5d7E05d3F250cF000eEc0891d00b51CC',
    [ChainId.MATIC_MAINNET]: '',
  },
  oracle: {
    [ChainId.MATIC_TESTNET]: '0xd2c250e7967edbe8812f91a86982e0e1d4d7d88e',
    [ChainId.MAINNET]: '0x79549758bdd539a19cd4e918989a424a6530af49',
    [ChainId.MATIC_MAINNET]: '0x08A6621bd0b9A5C0EF7058a19c37C7A77Fd9F9db',
  },
  aggregator: {
    [ChainId.MATIC_TESTNET]: '0x0637b5a1aa60ebb293b9ab512b7d2ef136ac38bb',
    [ChainId.MAINNET]: '0xdf6e0fdf55aaffe6a5ee6902a55179cfa6cde93e',
    [ChainId.MATIC_MAINNET]: '0x1ef81d9e323c7bAE5b2B0E9Ab78Fc75f5fE212Fa',
  },
  liquidityPool: {
    [ChainId.MATIC_TESTNET]: '0x9165628fa4f59ec72da254a32d053d22afd05997',
    [ChainId.MAINNET]: '0x219be861274f5b4c06a657566e0c49ec408b19fd',
    [ChainId.MATIC_MAINNET]: '0x62A4b8cD2D46E4541AeF12352664a5cb74ecA61F',
  },
  tradingPool: {
    [ChainId.MATIC_TESTNET]: '0xf511b83b13a6b94d02da243d08363ad4c585ea76',
    [ChainId.MAINNET]: '0x0ab66f50a8bda45f2c5621b92c788f4903c0c7bd',
    [ChainId.MATIC_MAINNET]: '0x7efD192dcade3AB4DEF8258030f672462384Bc8D',
  },
  vDSGToken: {
    [ChainId.MATIC_TESTNET]: '0xab7da5b9340abc67270d9f50dc6f174a9ee10368',
    [ChainId.MAINNET]: '0xc9e05fc26a7cf9843b013d3b9974eb6ef97e8e48',
    [ChainId.MATIC_MAINNET]: '0x8ee31e9c299959516266a1684FE90df69863B543',
  },
  NftEarnErc20Pool: {
    [ChainId.MATIC_TESTNET]: '0xa695a0c8c2c382b5f5f8825ca1e29e32659940b1',
    [ChainId.MAINNET]: '0xe266dce6f3fc8634e24251390b617215b693064a',
    [ChainId.MATIC_MAINNET]: '0x22502859F427C15C598813C1BA418F16d033FdA5',
  },
  Erc20EarnNftPool: {
    [ChainId.MATIC_TESTNET]: '0x5c29cdc538b4fb05dc056082b89872f94db3cce0',
    [ChainId.MAINNET]: '0xbe16b278b319bb77d5eb38ca2f85bf375beb3639',
    [ChainId.MATIC_MAINNET]: '0x1e7cB9cCE44A589E9E2431864176fabD3a4BfB9e',
  },
  nftMarket: {
    [ChainId.MATIC_TESTNET]: '0x34a806874dfedacfbf86b11317a2ab2bba33cb63',
    [ChainId.MAINNET]: '0x39b3159fd27d9cdaabcb0862eccec06a24133592',
    [ChainId.MATIC_MAINNET]: '0x95Ef201a445cB0b86DDfFD7083Ff0ce589Da4Ff2',
  },
  TFragmentPool: {
    [ChainId.MATIC_TESTNET]: '0x4b3198a5f89625647cca9b26908ce9878e4e3c69',
    [ChainId.MAINNET]: '0x86cae2e9ea49a31980a14b0f49a81dfc73e03b4c',
    [ChainId.MATIC_MAINNET]: '0x3dDF1ee4175f0C8d2a3b9B092F4dAA8BE8f1FA1D',
  },
  LiquidityPoolOther: {
    [ChainId.MATIC_TESTNET]: '0x4ae66ff652cebaac99faf2fb947e9e8621ad0d93',
    [ChainId.MAINNET]: '0xfBD1e13D0611693561C23a84d8C52b3D7cb0c070',
    [ChainId.MATIC_MAINNET]: '0x4028B8D1a77E495eE2B07CD7DeF973C89c717e0C',
  },
  liquidityV1Pool: {
    [ChainId.MATIC_TESTNET]: '0x219be861274f5b4c06a657566e0c49ec408b19fd',
    [ChainId.MAINNET]: '0x219be861274f5b4c06a657566e0c49ec408b19fd',
    [ChainId.MATIC_MAINNET]: '0x62A4b8cD2D46E4541AeF12352664a5cb74ecA61F',
  },
  FFragmentPool: {
    [ChainId.MATIC_TESTNET]: '0x86e89bee3ab249ff2b12a182bdfb70ab1f8cd189',
    [ChainId.MAINNET]: '0x947d20d51a8b27798d00fc62edb0a38325cc2340',
    [ChainId.MATIC_MAINNET]: '0x3718E85091E846aaAeeE1ffBf83562694f9a8B97',
  },
  MysteryBox: {
    [ChainId.MATIC_TESTNET]: '0x7504dc3edf73cda3acaafcdfe2561b5fe8ead2f8',
    [ChainId.MAINNET]: '0xc5d72d78bc378355c607f6ad9c0e4b491a31f962',
    [ChainId.MATIC_MAINNET]: '0xdFDBa3b67fEa64647a7B073FBc4Ba8d6B44e0Dcc',
  },
  DsgFoodNft: {
    [ChainId.MATIC_TESTNET]: '0x8150aad64f811f272e02f82b4dd52546eeff35f5',
    [ChainId.MAINNET]: '0xed2c000c1ff42d4e67876eee4fd247053b0a9bdc',
    [ChainId.MATIC_MAINNET]: '0xd45Fc33F6E138F1b3a16792a5C12dE6B5Db22981',
  },
  DsgMdNft: {
    [ChainId.MATIC_TESTNET]: '0xcf31a0abe9a026166a66b12ef207e959eb95ed7c',
    [ChainId.MAINNET]: '0xed2c000c1ff42d4e67876eee4fd247053b0a9bdc',
    [ChainId.MATIC_MAINNET]: '0xd45Fc33F6E138F1b3a16792a5C12dE6B5Db22981',
  },
  DsgNftFactorys: {
    [ChainId.MATIC_TESTNET]: '0xa3b8b055324c6dd750495a7688e466640f8ad5fe',
    [ChainId.MAINNET]: '0xed2c000c1ff42d4e67876eee4fd247053b0a9bdc',
    [ChainId.MATIC_MAINNET]: '0xd45Fc33F6E138F1b3a16792a5C12dE6B5Db22981',
  },
  SinglePoolFactory: {
    [ChainId.MATIC_TESTNET]: '0x55be7890cdd37c84509d022820e95e289fb4bf60',
    [ChainId.MAINNET]: '0x367588beb726f33b6eac52628caacd96af253848',
    [ChainId.MATIC_MAINNET]: '0x56b752CbC87c8A8092E443F9A80341A0c755b3bf',
  },
  vDsgAirdrop: {
    [ChainId.MATIC_TESTNET]: '0x25743f3a73d63c407a381a22d8705751ff97a8f5',
    [ChainId.MAINNET]: '0xB31d0faf058C7578cee6212Afe8E6DA58e20b4f7',
    [ChainId.MATIC_MAINNET]: '0x880a3bCB3427F5d48B5e7cD1A274eD90f61Df3A9',
  },
  SwapRouter: {
    [ChainId.MATIC_TESTNET]: '0xa89628c4d8d3eb60892eb90dbbf4b4e18f256831',
    [ChainId.MAINNET]: '0xd7640e400ebf44cb8d5803e7a34d936d294a3fc5',
    [ChainId.MATIC_MAINNET]: '0xF0a1CaB2e58A7C90D9b246633b9E3D6fe60aEcAf',
  },
  SwapFactory: {
    [ChainId.MATIC_TESTNET]: '0x72f3e913159399fb4f0dc18974a90791aa595bc3',
    [ChainId.MAINNET]: '0xd7640e400ebf44cb8d5803e7a34d936d294a3fc5',
    [ChainId.MATIC_MAINNET]: '0xF0a1CaB2e58A7C90D9b246633b9E3D6fe60aEcAf',
  },
  pairCodeHash: {
    [ChainId.MATIC_TESTNET]: '0x32890cd19dfef8a8745fd19c794ab655c6d1ee5ab4cd7af4e9312327ed7ee208',
    [ChainId.MAINNET]: '0x772d76e02b5a3aeeef00b07a18a744c893227f52ecb6e3d431da85a229ed6a1d',
    [ChainId.MATIC_MAINNET]: '0xF0a1CaB2e58A7C90D9b246633b9E3D6fe60aEcAf',
  },
}

export const EmptyAddress = {
  [ChainId.MATIC_TESTNET]: '',
  [ChainId.MATIC_MAINNET]: '',
  [ChainId.MAINNET]: '',
}
export const DSG_TOKENS_TOP100 = {
  [ChainId.MATIC_TESTNET]: 'https://sv.dsgmetaverse.com/tokens/tokens-top100.json',
  [ChainId.MATIC_MAINNET]: 'https://sv.dsgmetaverse.com/tokens/tokens-top100.json',
  [ChainId.MAINNET]: 'https://sv.dsgmetaverse.com/tokens/tokens-top100.json',
}
export const DSG_TOKENS_EXTENDED = {
  [ChainId.MATIC_TESTNET]: 'https://sv.dsgmetaverse.com/tokens/tokens.json',
  [ChainId.MATIC_MAINNET]: 'https://sv.dsgmetaverse.com/tokens/tokens.json',
  [ChainId.MAINNET]: 'https://sv.dsgmetaverse.com/tokens/tokens.json',
}

export const BASE_BSC_SCAN_URLS = {
  [ChainId.MAINNET]: 'https://polygonscan.com',
  [ChainId.MATIC_MAINNET]: 'https://polygonscan.com/',
  [ChainId.MATIC_TESTNET]: 'https://mumbai.polygonscan.com/',
  [ChainId.TESTNET]: 'https://mumbai.polygonscan.com',
}

export const ETHEREUM_CHAIN = {
  [ChainId.MAINNET]: {
    chainId: `0x${ChainId.MAINNET.toString(16)}`,
    chainName: 'Binance Smart Chain Mainnet',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'bnb',
      decimals: 18,
    },
    rpcUrls: [
      'https://bsc-dataseed1.ninicoin.io',
      'https://bsc-dataseed1.defibit.io',
      'https://bsc-dataseed.binance.org',
    ],
    blockExplorerUrls: [`${BASE_BSC_SCAN_URLS[ChainId.MAINNET]}/`],
  },
  [ChainId.TESTNET]: {
    chainId: `0x${ChainId.TESTNET.toString(16)}`,
    chainName: 'Binance Smart Chain Testnet',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'bnb',
      decimals: 18,
    },
    rpcUrls: [
      'https://data-seed-prebsc-1-s2.binance.org:8545/',
      'https://data-seed-prebsc-1-s3.binance.org:8545/',
      // 'https://data-seed-prebsc-2-s1.binance.org:8545/',
    ],
    blockExplorerUrls: [`${BASE_BSC_SCAN_URLS[ChainId.MAINNET]}/`],
  },
  [ChainId.MATIC_TESTNET]: {
    chainId: `0x${ChainId.MATIC_TESTNET.toString(16)}`,
    chainName: 'Polygon PoS Chain Testnet',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: [
      'https://matic-mumbai.chainstacklabs.com/',
      'https://matic-testnet-archive-rpc.bwarelabs.com/',
      'https://rpc-mumbai.maticvigil.com/',
      'https://polygon-mumbai.infura.io/v3/330472ed44dd4692a16dfcb4cc41f122',
    ],
    blockExplorerUrls: [`${BASE_BSC_SCAN_URLS[ChainId.MATIC_TESTNET]}/`],
  },
  [ChainId.MATIC_MAINNET]: {
    chainId: `0x${ChainId.MATIC_MAINNET.toString(16)}`,
    chainName: 'Polygon PoS Chain Mainnet',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: [
      'https://polygon-rpc.com/',
      // 'https://rpc-mainnet.matic.network/',
      'https://rpc-mainnet.maticvigil.com',
      'https://rpc-mainnet.matic.quiknode.pro',
    ],
    blockExplorerUrls: [`${BASE_BSC_SCAN_URLS[ChainId.MATIC_MAINNET]}/`],
  },
}