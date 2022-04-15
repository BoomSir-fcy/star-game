/// <reference types="react-scripts" />

interface Window {
  ethereum?: {
    isMetaMask?: true;
    on?: (...args: any[]) => Promise<void>;
    request?: (...args: any[]) => Promise<void>;
    enable?: () => void;
  };
  BinanceChain?: {
    bnbSign?: (
      address: string,
      message: string,
    ) => Promise<{ publicKey: string; signature: string }>;
  };
  MSStream?: boolean;

  PIXI: any;
  dragonBones: any;
}

declare module 'react-grid-layout';
declare module 'intro.js';
namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_CHAIN_ID: string;
  }
}
