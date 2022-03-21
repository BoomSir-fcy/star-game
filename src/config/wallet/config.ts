import Metamask from "uikit/components/Svg/WalletIcons/Metamask";
import WalletConnect from "uikit/components/Svg/WalletIcons/WalletConnect";
import TrustWallet from "uikit/components/Svg/WalletIcons/TrustWallet";
import MathWallet from "uikit/components/Svg/WalletIcons/MathWallet";
import TokenPocket from "uikit/components/Svg/WalletIcons/TokenPocket";
import BinanceChain from "uikit/components/Svg/WalletIcons/BinanceChain";
import SafePal from "uikit/components/Svg/WalletIcons/SafePal";
import Coin98 from "uikit/components/Svg/WalletIcons/Coin98";
import BitKeep from "uikit/components/Svg/WalletIcons/BitKeep";

import { Config, ConnectorNames } from "./types";

const connectors: Config[] = [
  {
    title: "Metamask",
    icon: Metamask,
    connectorId: ConnectorNames.Injected,
    priority: 1,
  },
  {
    title: "WalletConnect",
    icon: WalletConnect,
    connectorId: ConnectorNames.WalletConnect,
    priority: 2,
  },
  {
    title: "Trust Wallet",
    icon: TrustWallet,
    connectorId: ConnectorNames.Injected,
    priority: 3,
  },
  {
    title: "MathWallet",
    icon: MathWallet,
    connectorId: ConnectorNames.Injected,
    priority: 999,
  },
  {
    title: "TokenPocket",
    icon: TokenPocket,
    connectorId: ConnectorNames.Injected,
    priority: 999,
  },

  {
    title: "BitKeep",
    icon: BitKeep,
    connectorId: ConnectorNames.Injected,
    priority: 999,
  },
  {
    title: "Binance Chain",
    icon: BinanceChain,
    connectorId: ConnectorNames.BSC,
    priority: 999,
  },
  {
    title: "SafePal",
    icon: SafePal,
    connectorId: ConnectorNames.Injected,
    priority: 999,
  },
  {
    title: "Coin98",
    icon: Coin98,
    connectorId: ConnectorNames.Injected,
    priority: 999,
  },
];

export enum ChainId {
  BSC_MAINNET = 56,
  BSC_TESTNET = 97,
  MAINNET = 56,
  TESTNET = 222,
  MATIC_MAINET = 137,
  MATIC_MAINNET = 137,
  MATIC_TESTNET = 80001,
  // OKT = 66,
  // OKT = 65,
}

export const BASE_BSC_SCAN_URLS = {
  [ChainId.MAINNET]: 'https://polygonscan.com',
  [ChainId.TESTNET]: 'https://mumbai.polygonscan.com',
  [ChainId.BSC_MAINNET]: 'https://bscscan.com',
  [ChainId.BSC_TESTNET]: 'https://testnet.bscscan.com',
  [ChainId.MATIC_MAINET]: 'https://testnet.bscscan.com',
  [ChainId.MATIC_MAINNET]: 'https://polygonscan.com/',
  [ChainId.MATIC_TESTNET]: 'https://mumbai.polygonscan.com/',
}

export const walletIcon = {
  Metamask,
  WalletConnect,
  TrustWallet,
  MathWallet,
  TokenPocket,
  BinanceChain,
  SafePal,
  Coin98,
  BitKeep,
}

export default connectors;
export const connectorLocalStorageKey = "connectorIdv2";
export const walletLocalStorageKey = "wallet";
