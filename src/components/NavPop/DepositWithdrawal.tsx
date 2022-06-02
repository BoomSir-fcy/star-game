import React, { useCallback, useMemo, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Box, Button, PrimaryInput, Flex, Text, Image, Dots } from 'uikit';
import BigNumber from 'bignumber.js';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'contexts/Localization';
import { useWeb3React } from '@web3-react/core';
import { UserBalanceView } from 'state/types';
import { useGetBnbBalance, useTokenBalance } from 'hooks/useTokenBalance';
import { getBalanceAmount } from 'utils/formatBalance';
import { BIG_TEN } from 'config/constants/bigNumber';
import { fetchUserBalanceAsync } from 'state/userInfo/reducer';
import { useToast } from 'contexts/ToastsContext';
import { ConnectWalletButton } from 'components';
import { FetchApproveNum, useRWA } from './hook';

const ShaDowBox = styled(Flex)`
  width: 100%;
  height: 90px;
  background: ${({ theme }) => theme.colors.backgroundCard};
  box-shadow: inset 0px -1px 3px 0px rgba(255, 255, 255, 35%);
  border-radius: 10px;
  padding: 8px 22px;
  margin-bottom: 40px;
`;
const IconToken = styled(Image)`
  margin-right: 34px;
  min-width: 60px;
`;
const InputBox = styled(Flex)`
  position: relative;
  align-items: center;
`;

interface DepositWithdrawalProps {
  TokenInfo: UserBalanceView | any;
  decimals?: number;
  close: () => void;
}

const DepositWithdrawal: React.FC<DepositWithdrawalProps> = ({
  TokenInfo,
  decimals = 18,
  close,
}) => {
  const { toastError, toastSuccess, toastWarning } = useToast();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const { amount: withdrawalBalance, symbol: Token } = TokenInfo;
  const { balance: BigNumberBalance } = useTokenBalance(TokenInfo?.coinId);
  const { balance: bnbBalance } = useGetBnbBalance();

  const { Recharge, onApprove, drawCallback } = useRWA(TokenInfo?.coinId);

  const [approvedNum, setapprovedNum] = useState(0);
  const [val, setVal] = useState('');
  const [OperationType, setOperationType] = useState(1);
  const [pending, setpending] = useState(false);
  const [LoadApprovedNum, setLoadApprovedNum] = useState(false);

  const TokenBalance = useMemo(() => {
    if (Token === 'BNB') {
      return getBalanceAmount(bnbBalance).toString();
    }
    return getBalanceAmount(BigNumberBalance).toString();
  }, [BigNumberBalance, Token, bnbBalance]);

  // 复制地址
  const Copy = () => {
    const aux = document.createElement('input');
    const content = String(account);
    aux.setAttribute('value', content);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand('copy');
    document.body.removeChild(aux);
    toastSuccess(t('Copy Succeeded'));
  };

  // 充值、提取
  const handSure = useCallback(async () => {
    setpending(true);
    if (OperationType === 1) {
      // 充值
      if (TokenBalance === '0') {
        setpending(false);
        return;
      }
      if (new BigNumber(val).isLessThanOrEqualTo(0) || !val) {
        setpending(false);
        return;
      }
      const addPrecisionNum = new BigNumber(val)
        .times(BIG_TEN.pow(18))
        .toString();
      try {
        let isChainToken = false;
        if (Token === 'BNB') {
          isChainToken = true;
        }
        await Recharge(TokenInfo?.coinId, addPrecisionNum, isChainToken);
        toastSuccess(t('Recharge Succeeded'));
        close();
      } catch (error) {
        toastError(t('Recharge failed'));
        console.error(error);
      } finally {
        setpending(false);
      }
    } else {
      try {
        await drawCallback(val, TokenInfo?.coinId);
        toastSuccess(t('Withdraw Succeeded'));
        close();
      } catch (e) {
        toastError(t('Withdraw Failed'));
        console.error(e);
      } finally {
        setpending(false);
      }
    }
    dispatch(fetchUserBalanceAsync());
  }, [
    t,
    close,
    toastError,
    toastSuccess,
    setpending,
    OperationType,
    TokenBalance,
    TokenInfo?.coinId,
    Token,
    val,
    drawCallback,
    Recharge,
    dispatch,
  ]);
  // 授权
  const handleApprove = useCallback(async () => {
    setpending(true);
    try {
      await onApprove();
      toastSuccess(t('Approve Succeeded'));
    } catch (e) {
      console.error(e);
      toastError(t('Approve Failed'));
    } finally {
      setpending(false);
    }
    setLoadApprovedNum(false);
  }, [onApprove, toastSuccess, t, toastError, setpending]);

  // 输入框输入限制
  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      const chkPrice = (_val: string) => {
        const val2 = _val.replace(/,/g, '.');
        if (
          new BigNumber(val2).isGreaterThan(
            OperationType === 1 ? TokenBalance : withdrawalBalance,
          )
        ) {
          return OperationType === 1
            ? String(TokenBalance)
            : String(withdrawalBalance);
        }
        return String(val2);
      };
      if (e.currentTarget.validity.valid) {
        setVal(chkPrice(e.currentTarget.value));
      }
    },
    [setVal, OperationType, TokenBalance, withdrawalBalance],
  );

  useEffect(() => {
    const getApproveNum = async () => {
      const Num = await FetchApproveNum(String(account), TokenInfo?.coinId);
      console.log(Num);
      if (Num) {
        setapprovedNum(Num);
      }
    };
    if (account && TokenInfo?.coinId && !LoadApprovedNum) {
      getApproveNum();
      setLoadApprovedNum(true);
    }
  }, [account, TokenInfo?.coinId, LoadApprovedNum]);

  return (
    <Box width='100%' padding='30px 15px'>
      <Flex flexDirection='column' justifyContent='center'>
        <Text mb='20px' fontSize='24px'>
          {OperationType === 1
            ? t('Balance')
            : t('Wallet address for transfer-out')}
        </Text>
        <ShaDowBox alignItems='center' justifyContent='space-between'>
          <Flex alignItems='center'>
            {OperationType === 1 ? (
              <>
                <IconToken
                  width={60}
                  height={60}
                  src={
                    Token === 'DSG' || Token === 'BOX' || Token === 'BNB'
                      ? `/images/tokens/${Token}.svg`
                      : `/images/tokens/${Token}.png`
                  }
                  alt=''
                />
                <Text fontSize='38px' mr='16px'>
                  {withdrawalBalance}
                </Text>
                <Text fontSize='24px' color='textSubtle'>
                  {Token}
                </Text>
              </>
            ) : (
              <Text>{account}</Text>
            )}
          </Flex>
          <Text
            onClick={() => {
              if (OperationType === 1) {
                setVal('');
                setOperationType(2);
              } else {
                Copy();
              }
            }}
            style={{ cursor: 'pointer' }}
            fontSize='24px'
            color='textLink'
          >
            {OperationType === 1 ? t('Transfer-out') : t('Copy')}
          </Text>
        </ShaDowBox>
        <InputBox mb='10px'>
          <PrimaryInput
            style={{ fontSize: '26px' }}
            width='100%'
            height={90}
            disabled={
              approvedNum === 0 && OperationType === 1 && Token !== 'BNB'
            }
            pattern={`^[0-9]*[.,]?[0-9]{0,${decimals}}$`}
            inputMode='decimal'
            value={val}
            onChange={handleChange}
            placeholder={
              OperationType === 1
                ? t('Please enter the recharge amount')
                : t('Please enter the transfer amount')
            }
          />
        </InputBox>
        <Flex justifyContent='center' mt='40px'>
          {!account ? (
            <ConnectWalletButton scale='ld' width='270px' padding='0 10px' />
          ) : (
            <Button
              width='270px'
              disabled={pending}
              onClick={() => {
                if (OperationType === 2) {
                  handSure();
                  return;
                }
                if (approvedNum > 0 || Token === 'BNB') {
                  // 充值、提现
                  handSure();
                } else {
                  // 授权
                  handleApprove();
                }
              }}
            >
              {OperationType === 1 ? (
                approvedNum > 0 || Token === 'BNB' ? (
                  pending ? (
                    <Dots>{t('Recharging')}</Dots>
                  ) : (
                    t('Confirm Recharge')
                  )
                ) : pending ? (
                  <Dots>{t('Approving')}</Dots>
                ) : (
                  t('Approve')
                )
              ) : (
                t('Confirm Transfer-out')
              )}
            </Button>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default DepositWithdrawal;
