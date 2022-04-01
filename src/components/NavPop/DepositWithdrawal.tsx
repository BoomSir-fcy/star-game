import React, { useCallback, useMemo, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Box, Button, Input, Flex, Text, Image } from 'uikit';
import BigNumber from 'bignumber.js';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'contexts/Localization';
import { useWeb3React } from '@web3-react/core';
import { UserBalanceView } from 'state/types';
import { useTokenBalance } from 'hooks/useTokenBalance';
import { getBalanceAmount } from 'utils/formatBalance';
import { BIG_TEN } from 'config/constants/bigNumber';
import { fetchUserBalanceAsync } from 'state/userInfo/reducer';
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
const MyInput = styled(Input)`
  padding: 23px 34px;
  height: 90px;
  border: 2px solid;
  /* border-image: linear-gradient(-29deg, #14f1fd, #1caaf4) 2 2; */
  border: 1px solid #14f1fd;
  box-shadow: 0px 0px 9px 0px #41b7ff, inset 0px 0px 9px 0px #41b7ff;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.backgroundCard};
  font-size: 30px;
  &::placeholder {
    color: ${({ theme }) => theme.colors.textSubtle};
  }
`;

interface DepositWithdrawalProps {
  TokenInfo: UserBalanceView | any;
  decimals?: number;
}

const DepositWithdrawal: React.FC<DepositWithdrawalProps> = ({
  TokenInfo,
  decimals = 18,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const { amount: withdrawalBalance, symbol: Token } = TokenInfo;
  const { balance: BigNumberBalance } = useTokenBalance(TokenInfo?.coinId);
  const { Recharge, onApprove, drawCallback } = useRWA(TokenInfo?.coinId);

  const [approvedNum, setapprovedNum] = useState(0);
  const [val, setVal] = useState('');
  const [OperationType, setOperationType] = useState(1);
  const [pending, setpending] = useState(false);
  const [LoadApprovedNum, setLoadApprovedNum] = useState(false);

  const TokenBalance = useMemo(() => {
    return getBalanceAmount(BigNumberBalance).toString();
  }, [BigNumberBalance]);

  // 复制地址
  const Copy = () => {
    const aux = document.createElement('input');
    const content = String(account);
    aux.setAttribute('value', content);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand('copy');
    document.body.removeChild(aux);
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
      } catch (error) {
        console.error(error);
      } finally {
        setpending(false);
      }
    } else {
      try {
        await drawCallback(val, TokenInfo?.coinId);
      } catch (e) {
        console.error(e);
      } finally {
        setpending(false);
      }
    }
    dispatch(fetchUserBalanceAsync());
  }, [
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
    } catch (e) {
      console.error(e);
    } finally {
      setpending(false);
    }
    setLoadApprovedNum(false);
  }, [onApprove]);

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
          {OperationType === 1 ? t('指挥部资金余额') : t('转出钱包地址')}
        </Text>
        <ShaDowBox alignItems='center' justifyContent='space-between'>
          <Flex alignItems='center'>
            {OperationType === 1 ? (
              <>
                <IconToken
                  width={60}
                  height={60}
                  src={`/images/Token/${Token}.svg`}
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
                setOperationType(2);
              } else {
                Copy();
              }
            }}
            style={{ cursor: 'pointer' }}
            fontSize='24px'
            color='textLink'
          >
            {OperationType === 1 ? t('转出资金') : t('复制')}
          </Text>
        </ShaDowBox>
        <InputBox mb='10px'>
          <MyInput
            disabled={approvedNum === 0}
            noShadow
            pattern={`^[0-9]*[.,]?[0-9]{0,${decimals}}$`}
            inputMode='decimal'
            value={val}
            onChange={handleChange}
            placeholder={
              OperationType === 1 ? t('请输入充值数量') : t('请输入转出数量')
            }
          />
        </InputBox>
        <Flex justifyContent='center' mt='40px'>
          <Button
            width='270px'
            disabled={pending}
            onClick={() => {
              if (approvedNum > 0) {
                // 充值、提现
                handSure();
              } else {
                // 授权
                handleApprove();
              }
            }}
          >
            {OperationType === 1
              ? approvedNum > 0
                ? t('确认充值')
                : t('授权')
              : t('确认转出')}
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default DepositWithdrawal;
