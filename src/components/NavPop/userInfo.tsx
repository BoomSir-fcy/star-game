import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Box, Flex, Text, Image } from 'uikit';
import { useTranslation } from 'contexts/Localization';
import { useWeb3React } from '@web3-react/core';
import { AvatarBorder, AvatarImage } from 'components/Avatar/styled';
import connectors from 'config/wallet/config';
import { storage } from 'config';
import { Config } from 'config/wallet';
import WalletInfoBox from './walletInfo';

interface UserInfoProps {
  nftImage: string;
}

const UserInfo: React.FC<UserInfoProps> = ({ nftImage }) => {
  const { t } = useTranslation();
  const { account } = useWeb3React();

  const [WalletInfo, setWalletInfo] = useState<Config>();

  useEffect(() => {
    const getWalletInfo = () => {
      const wallet = window.localStorage.getItem('wallet') || '';
      const info = connectors.filter((item, index) => item.title === wallet);
      setWalletInfo(info[0]);
    };
    getWalletInfo();
  }, []);

  return (
    <Box width='100%' padding='100px 30px'>
      <Flex>
        <Box mr='40px' position='relative' width='300px' height='300px'>
          <AvatarImage src={nftImage} active />
          <AvatarBorder src='/images/login/a-b-man.png' active />
        </Box>
        <Box>
          <Text bold paddingTop='20px' mb='34px' fontSize='34px'>
            {t('胖哥')}
          </Text>
          {WalletInfo && (
            <WalletInfoBox
              walletConfig={WalletInfo}
              account={String(account)}
            />
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default UserInfo;
