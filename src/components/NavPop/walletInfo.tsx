import React from 'react';
import styled from 'styled-components';
import { Text, Flex, Box } from 'uikit';
import { Config } from 'config/wallet';
import { shortenAddress } from 'utils/contract';

interface Props {
  walletConfig: Config;
  account: string;
}

const WalletInfoBox: React.FC<Props> = ({ walletConfig, account }) => {
  const { title, icon: Icon } = walletConfig;

  return (
    <Flex>
      <Icon width='58px' mr='16px' />
      <Box>
        <Text ellipsis color='textSubtle' fontSize='22px'>
          {title}
        </Text>
        <Text ellipsis fontSize='26px'>
          {shortenAddress(account, 2)}
        </Text>
      </Box>
    </Flex>
  );
};

export default WalletInfoBox;
