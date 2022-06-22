import React, { useState } from 'react';
import styled from 'styled-components';

import Modal from 'components/Modal';
import InvitePop from 'components/NavPop/Invite';
import UserInfo from 'components/NavPop/userInfo';
import { useTranslation } from 'contexts/Localization';
import { Box, Flex, Text, Button } from 'uikit';
import { useStore } from 'state/util';
import { UserBalanceView } from 'state/types';
import { useToast } from 'contexts/ToastsContext';
import { getBoxAddress } from 'utils/addressHelpers';
import { TokenImage } from 'components/TokenImage';
import DepositWithdrawal from 'components/NavPop/DepositWithdrawal';

const TokenGroupBox = styled(Box)`
  width: 261px;
  height: 173px;
  background: url('/images/commons/dashboard/token-group.png');
  background-size: 100% 100%;
  padding: 8px 13px;
  padding-top: 16px;
  margin-left: -5px;
`;

const ButtonLeft = styled(Button)`
  width: 100%;
  height: 42px;
  /* background-color: pink; */
  margin: 5px 0;
  padding: 0 26px 0 22px;
  display: block;
`;

const TokenInfo = () => {
  const { t } = useTranslation();

  const [visible, setVisible] = useState(false);
  const [ActiveToken, setActiveToken] = useState<UserBalanceView>();

  const Balance = useStore(p => p.userInfo.userBalance);
  const Product = useStore(p => p.userInfo.userProduct);

  const { toastError } = useToast();

  const TokenBlance = React.useCallback(
    (Token: string) => {
      const balance = Balance.filter(item => {
        return item.symbol === Token;
      });
      return balance[0];
    },
    [Balance],
  );

  const openModalHandle = React.useCallback(
    (userBalanceView: UserBalanceView) => {
      if (userBalanceView) {
        setActiveToken(userBalanceView);
        setVisible(true);
      } else {
        toastError('Not support symbol');
      }
    },
    [setActiveToken, setVisible, toastError],
  );

  return (
    <Box mt='-8px' position='relative'>
      <Flex>
        <TokenGroupBox>
          <ButtonLeft
            onClick={() => {
              openModalHandle(TokenBlance('BOX'));
            }}
            variant='custom'
          >
            <Flex width='100%' alignItems='center'>
              <Flex alignItems='center' flex={1}>
                <Text ml='5px'>战斗力</Text>
                <Text mark fontSize='20px' bold ml='8px' ellipsis>
                  {TokenBlance('BOX')?.amount}
                </Text>
              </Flex>
            </Flex>
          </ButtonLeft>
          <ButtonLeft
            onClick={() => {
              openModalHandle(TokenBlance('BOX'));
            }}
            variant='custom'
          >
            <Flex width='100%' alignItems='center'>
              <Flex alignItems='center' flex={1}>
                <TokenImage
                  width={30}
                  height={32}
                  tokenAddress={getBoxAddress()}
                />
                <Text small ml='8px' ellipsis>
                  {TokenBlance('BOX')?.amount}
                </Text>
              </Flex>
              <Text ml='8px' small>
                {TokenBlance('BOX')?.symbol}
              </Text>
            </Flex>
          </ButtonLeft>
          <ButtonLeft
            onClick={() => {
              openModalHandle(TokenBlance('BNB'));
            }}
            variant='custom'
          >
            <Flex width='100%' alignItems='center'>
              <Flex alignItems='center' flex={1}>
                <TokenImage width={30} height={32} tokenAddress='BNB' />
                <Text small ml='8px' ellipsis>
                  {TokenBlance('BNB')?.amount}
                </Text>
              </Flex>
              <Text ml='8px' small>
                {TokenBlance('BNB')?.symbol}
              </Text>
            </Flex>
          </ButtonLeft>
        </TokenGroupBox>
        <TokenGroupBox>
          <ButtonLeft
            onClick={() => {
              openModalHandle(TokenBlance('ORE'));
            }}
            variant='custom'
          >
            <Flex width='100%' alignItems='center'>
              <Flex alignItems='center' flex={1}>
                <TokenImage width={30} height={32} tokenAddress='ORE' />
                <Text small ml='8px' ellipsis>
                  {Product.stone}
                </Text>
              </Flex>
              <Text ml='8px' small>
                {t('Ore ')}
              </Text>
            </Flex>
          </ButtonLeft>
          <ButtonLeft
            onClick={() => {
              openModalHandle(TokenBlance('SPICES'));
            }}
            variant='custom'
          >
            <Flex width='100%' alignItems='center'>
              <Flex alignItems='center' flex={1}>
                <TokenImage width={30} height={32} tokenAddress='SPICES' />
                <Text small ml='8px' ellipsis>
                  {Product.population}
                </Text>
              </Flex>
              <Text ml='8px' small>
                {t('SPICES ')}
              </Text>
            </Flex>
          </ButtonLeft>
          <ButtonLeft
            onClick={() => {
              openModalHandle(TokenBlance('ENG'));
            }}
            variant='custom'
          >
            <Flex width='100%' alignItems='center'>
              <Flex alignItems='center' flex={1}>
                <TokenImage width={30} height={32} tokenAddress='ENG' />
                <Text small ml='8px' ellipsis>
                  {Product.energy}
                </Text>
              </Flex>
              <Text ml='8px' small>
                {t('Energy ')}
              </Text>
            </Flex>
          </ButtonLeft>
        </TokenGroupBox>
      </Flex>
      <Modal
        title={`${ActiveToken?.symbol} ${t('Wallet')}`}
        visible={visible}
        setVisible={setVisible}
      >
        <DepositWithdrawal
          close={() => {
            setVisible(false);
          }}
          TokenInfo={ActiveToken}
        />
      </Modal>
    </Box>
  );
};

export default TokenInfo;
