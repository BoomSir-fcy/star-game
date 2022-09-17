import { ethers, Contract } from 'ethers';
/**
 * Estimate the gas needed to call a function, and add a 10% margin
 * @param contract Used to perform the call
 * @param methodName The name of the methode called
 * @param gasMarginPer10000 The gasMargin per 10000 (i.e. 10% -> 1000)
 * @param args An array of arguments to pass to the method
 * @returns https://docs.ethers.io/v5/api/providers/types/#providers-TransactionReceipt
 */
export declare const estimateGas: (contract: Contract, methodName: string, methodArgs: any[]) => Promise<ethers.BigNumber>;
/**
 * Perform a contract call with a gas value returned from estimateGas
 * @param contract Used to perform the call
 * @param methodName The name of the methode called
 * @param args An array of arguments to pass to the method
 * @returns https://docs.ethers.io/v5/api/providers/types/#providers-TransactionReceipt
 */
export declare const callWithEstimateGas: (contract: Contract, methodName: string, methodArgs?: any[]) => Promise<ethers.providers.TransactionResponse>;
