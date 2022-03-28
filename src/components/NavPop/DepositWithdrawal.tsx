import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Box, Button, Input, Flex, Text, Image } from 'uikit';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'contexts/Localization';
import { useWeb3React } from '@web3-react/core';

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
  border-image: linear-gradient(-29deg, #14f1fd, #1caaf4) 2 2;
  box-shadow: inset 0px 0px 20px 0px #f9f9f99c;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.backgroundCard};
  font-size: 30px;
  &::placeholder {
    color: ${({ theme }) => theme.colors.textSubtle};
  }
`;

interface DepositWithdrawalProps {
  Token: string;
  decimals?: number;
  balance: string;
}

const DepositWithdrawal: React.FC<DepositWithdrawalProps> = ({
  Token,
  decimals = 18,
  balance,
}) => {
  const { t } = useTranslation();
  const { account } = useWeb3React();

  const [approvedNum, setapprovedNum] = useState(10);
  const [val, setVal] = useState('');
  const [OperationType, setOperationType] = useState(1);
  const [withdrawalBalance, setwithdrawalBalance] = useState('0');

  const Copy = () => {
    const aux = document.createElement('input');
    const content = String(account);
    aux.setAttribute('value', content);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand('copy');
    document.body.removeChild(aux);
  };

  // 输入框输入限制
  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      const chkPrice = (_val: string) => {
        const val2 = _val.replace(/,/g, '.');
        if (
          new BigNumber(val2).isGreaterThan(
            OperationType === 1 ? balance : withdrawalBalance,
          )
        ) {
          return OperationType === 1 ? balance : withdrawalBalance;
        }
        return val2;
      };
      if (e.currentTarget.validity.valid) {
        setVal(chkPrice(e.currentTarget.value));
      }
    },
    [setVal, OperationType, balance, withdrawalBalance],
  );

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
                  100
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
          <Button width='270px'>
            {OperationType === 1 ? t('确认充值') : t('确认转出')}
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default DepositWithdrawal;
