/**
 * Truncates a wallet's address
 */
declare const truncateWalletAddress: (address: string, startLength?: number, endLength?: number) => string;
export default truncateWalletAddress;
