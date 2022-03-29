import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useWeb3React } from '@web3-react/core';
import { Flex, Text, Button, Image, Box } from 'uikit';
import Modal from 'components/Modal';
import { useStore } from 'state';
import BigNumber from 'bignumber.js';
import ApproveButton from 'components/ApproveButton';
import { getUserAgentAddress } from 'utils/addressHelpers';
import { fetchAllowanceAsync } from 'state/userInfo/reducer';
import { useDispatch } from 'react-redux';

interface RegisterModalProps {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  price: string;
  token: string;
  account: string;
  onRegister: () => void;
}
const RegisterModal: React.FC<RegisterModalProps> = ({
  visible,
  setVisible,
  price,
  token,
  account,
  onRegister,
}) => {
  const { allowance } = useStore(p => p.userInfo);
  const dispatch = useDispatch();

  const isApprove = useMemo(() => {
    return new BigNumber(allowance.allowance).isGreaterThanOrEqualTo(price);
  }, [allowance.allowance, price]);

  console.log(allowance);

  return (
    <Modal title='确认创建' visible={visible} setVisible={setVisible}>
      <Flex pt='98px' flexDirection='column' alignItems='center'>
        <Image src='/images/commons/dsg-1.png' width={109} height={114} />
        <Text mt='42px' fontSize='24px'>
          创建身份所需支付100 DSG
        </Text>
        {isApprove ? (
          <Button onClick={onRegister} mt='58px'>
            确认支付
          </Button>
        ) : (
          <ApproveButton
            mt='58px'
            erc20Token={token}
            spender={getUserAgentAddress()}
            onFinish={() => {
              if (account && token) {
                console.log(token, account);
                dispatch(fetchAllowanceAsync({ token, account }));
              }
            }}
          />
        )}
      </Flex>
    </Modal>
  );
};

export default RegisterModal;