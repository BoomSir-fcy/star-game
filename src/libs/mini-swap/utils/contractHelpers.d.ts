import { ethers } from 'ethers';
export declare const getBep20Contract: (address: string, signer?: ethers.Signer | ethers.providers.Provider) => ethers.Contract;
export declare const getErc721Contract: (address: string, signer?: ethers.Signer | ethers.providers.Provider) => ethers.Contract;
export declare const getMulticallContract: (signer?: ethers.Signer | ethers.providers.Provider) => ethers.Contract;
