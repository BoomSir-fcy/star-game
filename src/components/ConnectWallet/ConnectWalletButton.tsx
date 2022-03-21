import React from 'react';
import { Box, Button, ButtonProps, Dots } from 'uikit';
import { useTranslation } from 'contexts/Localization';
import { useConnectWallet } from 'contexts/ConnectWallet';

export const ConnectWalletButton: React.FC<ButtonProps> = props => {
  const { t } = useTranslation();

  const { onConnectWallet } = useConnectWallet();

  const { isLoading } = props

  return (
    <Box>
      <Button
        disabled={isLoading}
        onClick={(e: { preventDefault: () => void; stopPropagation: () => void; }) => {
          e.preventDefault();
          e.stopPropagation();
          onConnectWallet();
        }}
        width='205px'
        {...props}
      >
        {isLoading ? (
          <Dots>{t('Connect Wallet')}</Dots>
        ) : (
          t('Connect Wallet')
        )}
      </Button>
    </Box>
  );
};
