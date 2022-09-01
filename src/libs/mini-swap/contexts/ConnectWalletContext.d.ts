import React from 'react';
declare const ConnectWallet: React.Context<{
    onConnectWallet: any;
}>;
declare const ConnectWalletProvider: ({ children, onConnectWallet }: {
    children: any;
    onConnectWallet: any;
}) => JSX.Element;
export { ConnectWallet, ConnectWalletProvider };
