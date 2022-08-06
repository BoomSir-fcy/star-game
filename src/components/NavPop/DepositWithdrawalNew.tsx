import React, { useCallback, useMemo, useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  Box,
  Button,
  Input,
  Flex,
  Text,
  Image,
  Dots,
  GraphicsCard,
} from 'uikit';
import BigNumber from 'bignumber.js';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'contexts/Localization';
import { useWeb3React } from '@web3-react/core';
import { UserBalanceView } from 'state/types';
import { useGetBnbBalance, useTokenBalance } from 'hooks/useTokenBalance';
import { getBalanceAmount } from 'utils/formatBalance';
import { BIG_TEN } from 'config/constants/bigNumber';
import {
  fetchUserBalanceAsync,
  fetchUserProductAsync,
} from 'state/userInfo/reducer';
import { useToast } from 'contexts/ToastsContext';
import { ConnectWalletButton } from 'components';
import { Api } from 'apis';
import { useStore } from 'state';
import { Select } from 'components/Select';
import Modal from 'components/Modal';
import { shortenAddress } from 'utils/contract';
import { FetchApproveNum, useRWA } from './hook';

const IconToken = styled(Image)`
  margin-right: 16px;
`;
const InputStyle = styled(Input)`
  border: none;
  background-color: transparent !important;
  text-indent: 20px;
`;

interface DepositWithdrawalProps {
  decimals?: number;
  OperationType: number;
  close: () => void;
  visible: boolean;
}

const DepositWithdrawalModule: React.FC<DepositWithdrawalProps> = ({
  decimals = 18,
  OperationType = 1,
  visible,
  close,
}) => {
  const { toastError, toastSuccess, toastWarning } = useToast();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const Balance = useStore(p => p.userInfo.userBalance);
  const { buyPrice } = useStore(p => p.guide);

  const [BalanceList, setBalanceList] = useState<UserBalanceView[]>(Balance);
  const [TokenInfo, setTokenInfo] = useState<UserBalanceView>(BalanceList[0]);

  const { amount: withdrawalBalance, symbol: Token } = TokenInfo;
  const { balance: BigNumberBalance } = useTokenBalance(TokenInfo?.coinId);
  const { balance: bnbBalance } = useGetBnbBalance();

  const { Recharge, onApprove, drawCallback } = useRWA(TokenInfo?.coinId);

  const [approvedNum, setapprovedNum] = useState(0);
  const [val, setVal] = useState(buyPrice);
  const [pending, setpending] = useState(false);
  const [LoadApprovedNum, setLoadApprovedNum] = useState(false);

  const TokenOption = useMemo(() => {
    const List = BalanceList.map((item, index) => {
      return {
        value: index,
        label: item.symbol,
        icon: (
          <IconToken
            width={40}
            height={40}
            src={
              item.symbol === 'BOX' || item.symbol === 'BNB'
                ? `/images/tokens/${item.symbol}.svg`
                : `/images/tokens/${item.symbol}.png`
            }
            alt=''
          />
        ),
      };
    });
    return List;
  }, [BalanceList]);

  const TokenBalance = useMemo(() => {
    let balance = getBalanceAmount(BigNumberBalance).toString();
    if (Token === 'BNB') {
      balance = getBalanceAmount(bnbBalance).toString();
    }
    if (balance.indexOf('-') >= 0) {
      // 科学计数法转化
      balance = `0${String(Number(balance) + 1).substring(1)}`;
    }
    return balance;
  }, [BigNumberBalance, Token, bnbBalance]);

  const ShowMaxBtn = useMemo(() => {
    // if (
    //   TokenInfo.symbol === 'ORE' ||
    //   TokenInfo.symbol === 'SPICES' ||
    //   TokenInfo.symbol === 'ENG'
    // ) {
    //   return true;
    // }
    // if (OperationType !== 1) {
    //   return true;
    // }
    // return false;
    return true;
  }, []);

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

  // 获取授权余额
  const getApproveNum = useCallback(
    async (addr: string, coinId: string) => {
      const Num = await FetchApproveNum(String(addr), coinId);
      if (Num) {
        setapprovedNum(Num);
      }
    },
    [setapprovedNum],
  );
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
        toastSuccess(t('Deposit Succeeded'));
        close();
      } catch (error) {
        toastError(t('Deposit failed'));
        console.error(error);
      }
    } else {
      const res = await drawCallback(val, TokenInfo?.coinId);
      if (Api.isSuccess(res)) {
        toastSuccess(t('Withdraw Succeeded'));
        close();
      }
    }
    dispatch(fetchUserBalanceAsync());
    dispatch(fetchUserProductAsync());
    setpending(false);
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
    getApproveNum(account, TokenInfo.coinId);
  }, [
    account,
    TokenInfo.coinId,
    onApprove,
    toastSuccess,
    t,
    toastError,
    setpending,
    getApproveNum,
  ]);

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

  // 去除不需要币种
  useEffect(() => {
    const needList = Balance.filter(item => {
      return item.symbol !== 'DSG';
    });
    setBalanceList(needList);
  }, [Balance]);

  useEffect(() => {
    // const getApproveNum = async () => {
    //   const Num = await FetchApproveNum(String(account), TokenInfo?.coinId);
    //   if (Num) {
    //     setapprovedNum(Num);
    //   }
    // };
    if (account && TokenInfo?.coinId) {
      getApproveNum(account, TokenInfo?.coinId);
    }
  }, [account, TokenInfo, getApproveNum]);

  return (
    <Modal
      title={OperationType === 1 ? t('Deposit') : t('Withdraw')}
      visible={visible}
      setVisible={close}
    >
      <Box width='100%' padding='15px'>
        <Flex
          width='80%'
          margin='80px auto 0'
          flexDirection='column'
          justifyContent='center'
        >
          <Flex mb='20px' height='54px' justifyContent='space-between'>
            <Select
              height='100%'
              Isradius
              childrenHeight='200px'
              width='180px'
              options={TokenOption}
              defaultId={TokenInfo.coinId}
              onChange={option => {
                setVal('');
                setapprovedNum(0);
                setTokenInfo(BalanceList[option.value]);
              }}
            />
            <Flex ml='16px' flex='1'>
              <GraphicsCard
                padding={0}
                isRadius
                stripe
                width='100%'
                height='100%'
              >
                <Flex height='100%' alignItems='center'>
                  <InputStyle
                    style={{ fontSize: '20px' }}
                    width={ShowMaxBtn ? '86%' : '100%'}
                    height='100%'
                    disabled={
                      approvedNum === 0 &&
                      OperationType === 1 &&
                      Token !== 'BNB'
                    }
                    pattern={`^[0-9]*[.,]?[0-9]{0,${decimals}}$`}
                    inputMode='decimal'
                    value={val}
                    onChange={handleChange}
                    placeholder={
                      OperationType === 1
                        ? t('Please enter the deposit amount')
                        : t('Please enter the transfer amount')
                    }
                  />
                  {ShowMaxBtn && (
                    <Button
                      variant='text'
                      padding={0}
                      onClick={() => {
                        const max =
                          OperationType === 1
                            ? String(TokenBalance)
                            : String(withdrawalBalance);
                        setVal(max);
                      }}
                    >
                      <Text color='textPrimary' fontSize='18px'>
                        MAX
                      </Text>
                    </Button>
                  )}
                </Flex>
              </GraphicsCard>
            </Flex>
          </Flex>
          <Flex justifyContent='space-between' alignItems='flex-end'>
            <Text fontSize='18px'>
              {t('Balance')} :{' '}
              {OperationType === 1 ? TokenBalance : withdrawalBalance}
            </Text>
            <Flex justifyContent='space-between' alignItems='flex-end'>
              <Text ellipsis fontSize='18px'>
                {shortenAddress(account, 8)}
              </Text>
              <Text
                ml='6px'
                onClick={() => {
                  Copy();
                }}
                style={{ cursor: 'pointer' }}
                fontSize='18px'
                color='textPrimary'
              >
                {t('Copy')}
              </Text>
            </Flex>
          </Flex>
          <Flex justifyContent='center' mt='40px'>
            {!account ? (
              <ConnectWalletButton scale='ld' width='270px' padding='0 10px' />
            ) : (
              <Button
                padding='0 20px'
                variant='purple'
                width='max-content'
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
                      <Dots>{t('Depositing')}</Dots>
                    ) : (
                      t('Confirm Deposit')
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
    </Modal>
  );
};

export default DepositWithdrawalModule;
