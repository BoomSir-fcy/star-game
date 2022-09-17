import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'contexts/Localization';
import { Box, Flex, Text, Button, Image } from 'uikit';
import { UserBalanceView } from 'state/types';
import { useToast } from 'contexts/ToastsContext';
import { getBoxAddress } from 'utils/addressHelpers';
import { TokenImage } from 'components/TokenImage';
import {
  formatLocalisedCompactBalance_b,
  formatDisplayApr,
} from 'utils/formatBalance';
import { storeAction, useStore } from 'state';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

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
  padding: 0;
`;

const ButtonStyled = styled(Button)`
  width: 69px;
  height: 34px;
  padding: 0;
  font-size: 14px;
`;
const ButtonStyled1 = styled(ButtonStyled)`
  background: url('/images/commons/btn/t1.png');
  background-size: cover;
`;
const ButtonStyled2 = styled(ButtonStyled)`
  background: url('/images/commons/btn/t2.png');
  background-size: cover;
`;
const ButtonStyled3 = styled(ButtonStyled)`
  background: url('/images/commons/btn/t3.png');
  background-size: cover;
`;

const TokenInfo = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

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
    return formatLocalisedCompactBalance_b(number) || 0;
  }, []);
  return (
    <Box mt='-8px' position='relative'>
      <Flex>
        <TokenGroupBox id='BNB_Box'>
          <DepositWithdrawalBtn>
            <ButtonStyled1
              onClick={() => {
                dispatch(
                  storeAction.setRechargeOperationType({ OperationType: 1 }),
                );
                dispatch(storeAction.setToRechargeVisible({ visible: true }));
              }}
              variant='custom'
            >
              <Text color='#4FFFFB' small>
                Deposit
              </Text>
            </ButtonStyled1>
            <ButtonStyled2
              onClick={() => {
                dispatch(
                  storeAction.setRechargeOperationType({ OperationType: 2 }),
                );
                dispatch(storeAction.setToRechargeVisible({ visible: true }));
              }}
              variant='custom'
            >
              <Text color='#FF7C7C' small>
                Withdraw
              </Text>
            </ButtonStyled2>
            <Link to='/swap'>
              <ButtonStyled3 variant='custom'>
                <Text color='#92F4A8' small>
                  Swap
                </Text>
              </ButtonStyled3>
            </Link>
            {/* <Image
              style={{ cursor: 'pointer' }}
              width={36}
              height={36}
              src='/images/commons/icon/add.png'
              onClick={() => {
                dispatch(
                  storeAction.setRechargeOperationType({ OperationType: 1 }),
                );
                dispatch(storeAction.setToRechargeVisible({ visible: true }));
              }}
            />
            <Image
              style={{ cursor: 'pointer' }}
              width={36}
              height={36}
              src='/images/commons/icon/withDrawal.png'
              onClick={() => {
                dispatch(
                  storeAction.setRechargeOperationType({ OperationType: 2 }),
                );
                dispatch(storeAction.setToRechargeVisible({ visible: true }));
              }}
            /> */}
          </DepositWithdrawalBtn>
          <ButtonLeft disabled variant='custom'>
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
          <ButtonLeft disabled variant='custom'>
            <Flex width='100%' alignItems='center'>
              <Flex alignItems='center' flex={1}>
                <Image width={30} height={32} src='/images/tokens/BOX.svg' />
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
          <ButtonLeft disabled variant='custom'>
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
        <TokenGroupBox id='resourceToken'>
          <ButtonLeft disabled variant='custom'>
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
          <ButtonLeft disabled variant='custom'>
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
          <ButtonLeft disabled variant='custom'>
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
        </TokenGroupBox>
      </Flex>
      {/* <Modal
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
      </Modal> */}
    </Box>
  );
};

export default TokenInfo;
