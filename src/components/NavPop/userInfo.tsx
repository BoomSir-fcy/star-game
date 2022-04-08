import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Box, Flex, Text, Image } from 'uikit';
import { useTranslation } from 'contexts/Localization';
import { useWeb3React } from '@web3-react/core';
import connectors from 'config/wallet/config';
import { Config } from 'config/wallet';
import { useStore } from 'state/util';
import KingAvatar from 'views/Galaxy/components/KingAvatar';
import WalletInfoBox from './walletInfo';

const UserInfo: React.FC = () => {
  const { t } = useTranslation();
  const { account } = useWeb3React();

  const [WalletInfo, setWalletInfo] = useState<Config>();
  const { userInfo } = useStore(p => p.userInfo);

  useEffect(() => {
    const getWalletInfo = () => {
      const wallet = window.localStorage.getItem('wallet') || '';
      const info = connectors.filter(item => item.title === wallet);
      setWalletInfo(info[0]);
    };
    getWalletInfo();
  }, []);

  return (
    <Box width='100%' padding='100px 30px'>
      <Flex>
        <Box mr='40px' position='relative' width='300px' height='300px'>
          <KingAvatar
            width='300px'
            height='300px'
            sex='normal'
            url={userInfo?.avatar}
          />
        </Box>
        <Box>
          <Text bold paddingTop='20px' mb='34px' fontSize='34px'>
            {userInfo.nickname}
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
