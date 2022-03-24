import React from 'react';
import styled from 'styled-components';
import { Text, Button, useMatchBreakpoints } from 'uikit';
import {
  walletLocalStorageKey,
  connectorLocalStorageKey,
} from 'config/wallet/config';
import { ConnectorNames, Login, Config } from 'config/wallet';

interface Props {
  walletConfig: Config;
  login: Login;
}

const WalletButton = styled(Button).attrs({ width: '100%', variant: 'text' })`
  align-items: center;
  display: flex;
  /* flex-direction: column; */
  height: auto;
  justify-content: flex-start;
  margin-left: auto;
  margin-right: auto;
  background-color: ${({ theme }) => theme.colors.inputSelect};
  width: 200px;
  max-width: 100%;
  min-width: 100px;
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 8px;
  ${({ theme }) => theme.mediaQueries.md} {
    padding-left: 20px;
  }
`;

const WalletItem: React.FC<Props> = ({ login, walletConfig }) => {
  const { title, icon: Icon } = walletConfig;
  const { isMd, isLg, isXl, isXxl } = useMatchBreakpoints();

  return (
    <WalletButton
      variant='tertiary'
      onClick={() => {
        const isIOS =
          /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

        // Since iOS does not support Trust Wallet we fall back to WalletConnect
        if (walletConfig.title === 'Trust Wallet' && isIOS) {
          login(ConnectorNames.WalletConnect);
        } else {
          login(walletConfig.connectorId);
        }

        localStorage.setItem(walletLocalStorageKey, walletConfig.title);
        localStorage.setItem(
          connectorLocalStorageKey,
          walletConfig.connectorId,
        );
        // onDismiss();
      }}
      id={`wallet-connect-${title.toLocaleLowerCase()}`}
    >
      {isMd || isLg || isXl || isXxl ? (
        <Icon width='40px' mr='16px' />
      ) : (
        <Icon width='30px' mr='8px' />
      )}
      <Text ellipsis fontSize='14px'>
        {title}
      </Text>
    </WalletButton>
  );
};

export default WalletItem;
