/// <reference types="react-scripts" />

interface Window {
  ethereum?: {
    isMetaMask?: true;
    on?: (...args: any[]) => Promise<void>;
    request?: (...args: any[]) => Promise<void>;
    enable?: Function;
  };
  BinanceChain?: {
    bnbSign?: (
      address: string,
      message: string
    ) => Promise<{ publicKey: string; signature: string }>;
  };
  MSStream?: boolean;
}