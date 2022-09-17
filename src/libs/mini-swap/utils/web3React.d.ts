import { ConnectorNames } from 'pancake-uikit';
import { ethers } from 'ethers';
export declare const connectorsByName: {
    [connectorName in ConnectorNames]: any;
};
export declare const getLibrary: (provider: any) => ethers.providers.Web3Provider;
/**
 * BSC Wallet requires a different sign method
 * @see https://docs.binance.org/smart-chain/wallet/wallet_api.html#binancechainbnbsignaddress-string-message-string-promisepublickey-string-signature-string
 */
export declare const signMessage: (provider: any, account: string, message: string) => Promise<string>;
