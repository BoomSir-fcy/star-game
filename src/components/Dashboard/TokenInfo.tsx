import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

import Modal from 'components/Modal';
import InvitePop from 'components/NavPop/Invite';
import UserInfo from 'components/NavPop/userInfo';
import { useTranslation } from 'contexts/Localization';
import { Box, Flex, Text, Button, Image } from 'uikit';
import { useStore } from 'state/util';
import { UserBalanceView } from 'state/types';
import { useToast } from 'contexts/ToastsContext';
import { getBoxAddress } from 'utils/addressHelpers';
import { TokenImage } from 'components/TokenImage';
import DepositWithdrawal from 'components/NavPop/DepositWithdrawal';
import {
  splitThousandSeparator,
  formatLocalisedCompactBalance,
  formatDisplayApr,
} from 'utils/formatBalance';
import BigNumber from 'bignumber.js';
import DepositWithdrawalModule from 'components/NavPop/DepositWithdrawalNew';

const TokenGroupBox = styled(Box)`
  width: 261px;
  height: 173px;
  background: url('/images/commons/dashboard/token-group.png');
  background-size: 100% 100%;
  padding: 8px 13px;
  padding-top: 16px;
  margin-left: -5px;
  position: relative;
`;

const ButtonLeft = styled(Button)`
  width: 100%;
  height: 42px;
  /* background-color: pink; */
  margin: 5px 0;
  padding: 0 26px 0 22px;
  display: block;
  &:disabled {
    cursor: auto;
    background: none;
  }
`;

const DepositWithdrawalBtn = styled(Flex)`
  position: absolute;
  bottom: -20px;
  width: 90%;
  height: 36px;
  justify-content: space-between;
  align-items: center;
  padding: 0 60px;
`;

const TokenInfo = () => {
  const { t } = useTranslation();

  const [visible, setVisible] = useState(false);
  const [ActiveToken, setActiveToken] = useState<UserBalanceView>();
  const [OperationType, setOperationType] = useState(1);
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

  const format = useCallback((number: number) => {
    return formatLocalisedCompactBalance(number);
  }, []);
  return (
    <Box mt='-8px' position='relative'>
      <Flex>
        <TokenGroupBox>
          <DepositWithdrawalBtn>
            <Image
              style={{ cursor: 'pointer' }}
              width={36}
              height={36}
              src='/images/commons/icon/add.png'
              onClick={() => {
                setOperationType(1);
                setVisible(true);
              }}
            />
            <Image
              style={{ cursor: 'pointer' }}
              width={36}
              height={36}
              src='/images/commons/icon/withDrawal.png'
              onClick={() => {
                setOperationType(2);
                setVisible(true);
              }}
            />
          </DepositWithdrawalBtn>
          <ButtonLeft
            disabled
            onClick={() => {
              openModalHandle(TokenBlance('BOX'));
            }}
            variant='custom'
          >
            <Flex width='100%' alignItems='center'>
              <Flex justifyContent='space-between' alignItems='center' flex={1}>
                <Text ml='5px'>{t('Power')}</Text>
                <Text
                  maxWidth='130px'
                  mark
                  fontSize='20px'
                  fontStyle='normal'
                  bold
                  ml='8px'
                  ellipsis
                  title={`${Product.power}`}
                >
                  {formatDisplayApr(Product.power)}
                </Text>
              </Flex>
            </Flex>
          </ButtonLeft>
          <ButtonLeft
            disabled
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
                <Text
                  small
                  ml='8px'
                  ellipsis
                  title={`${TokenBlance('BOX')?.amount}`}
                >
                  {format(TokenBlance('BOX')?.amount)}
                </Text>
              </Flex>
              <Text ml='8px' small>
                {TokenBlance('BOX')?.symbol}
              </Text>
            </Flex>
          </ButtonLeft>
          <ButtonLeft
            disabled
            onClick={() => {
              openModalHandle(TokenBlance('BNB'));
            }}
            variant='custom'
          >
            <Flex width='100%' alignItems='center'>
              <Flex alignItems='center' flex={1}>
                <TokenImage width={30} height={32} tokenAddress='BNB' />
                <Text
                  small
                  ml='8px'
                  ellipsis
                  title={`${TokenBlance('BNB')?.amount}`}
                >
                  {format(TokenBlance('BNB')?.amount)}
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
            disabled
            onClick={() => {
              openModalHandle(TokenBlance('ORE'));
            }}
            variant='custom'
          >
            <Flex width='100%' alignItems='center'>
              <Flex alignItems='center' flex={1}>
                <TokenImage width={35} height={35} tokenAddress='ORE' />
                <Text small ml='8px' ellipsis title={`${Product.stone}`}>
                  {format(Product.stone)}
                </Text>
              </Flex>
              <Text ml='8px' small>
                {t('Ore ')}
              </Text>
            </Flex>
          </ButtonLeft>
          <ButtonLeft
            disabled
            onClick={() => {
              openModalHandle(TokenBlance('SPICES'));
            }}
            variant='custom'
          >
            <Flex width='100%' alignItems='center'>
              <Flex alignItems='center' flex={1}>
                <TokenImage width={35} height={35} tokenAddress='SPICES' />
                <Text small ml='8px' ellipsis title={`${Product.population}`}>
                  {format(Product.population)}
                </Text>
              </Flex>
              <Text ml='8px' small>
                {t('Population')}
              </Text>
            </Flex>
          </ButtonLeft>
          <ButtonLeft
            disabled
            onClick={() => {
              openModalHandle(TokenBlance('ENG'));
            }}
            variant='custom'
          >
            <Flex width='100%' alignItems='center'>
              <Flex alignItems='center' flex={1}>
                <TokenImage width={35} height={35} tokenAddress='ENG' />
                <Text small ml='8px' ellipsis title={`${Product.energy}`}>
                  {format(Product.energy)}
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
        title={OperationType === 1 ? t('Deposit') : t('Withdraw')}
        visible={visible}
        setVisible={setVisible}
      >
        <DepositWithdrawalModule
          OperationType={OperationType}
          close={() => {
            setVisible(false);
          }}
        />
      </Modal>
    </Box>
  );
};

export default TokenInfo;
