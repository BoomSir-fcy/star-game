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
import { formatDisplayBalance } from 'utils/formatBalance';
import { useTranslation } from 'contexts/Localization';

interface RegisterModalProps {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  price: string;
  BNBprice: string;
  DsgBalance: BigNumber;
  token: string;
  account: string;
  onRegister: (payType: string) => void;
}
const RegisterModal: React.FC<RegisterModalProps> = ({
  visible,
  setVisible,
  price,
  BNBprice,
  DsgBalance,
  token,
  account,
  onRegister,
}) => {
  const { allowance } = useStore(p => p.userInfo);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const isApprove = useMemo(() => {
    return new BigNumber(allowance.allowance).isGreaterThanOrEqualTo(price);
  }, [allowance.allowance, price]);

  return (
    <Modal
      title={t('Confirm to create')}
      visible={visible}
      setVisible={setVisible}
    >
      <Flex padding='30px' flexDirection='column' alignItems='center'>
        <Image src='/images/commons/dsg-1.png' width={109} height={114} />
        {DsgBalance.isLessThan(price) ? (
          <Text mt='20px' fontSize='24px'>
            {t('BnbRegister', {
              DSG: formatDisplayBalance(new BigNumber(price), 18),
              BNB: formatDisplayBalance(new BigNumber(BNBprice), 18),
            })}{' '}
          </Text>
        ) : (
          <Text mt='20px' fontSize='24px'>
            {t('Payment for creating identity')}{' '}
            {formatDisplayBalance(new BigNumber(price), 18)} DSG
          </Text>
        )}
        {isApprove || DsgBalance.isLessThan(price) ? (
          <Button
            width='50%'
            variant='purple'
            onClick={() => {
              if (DsgBalance.isLessThan(price)) {
                onRegister('BNB');
              } else {
                onRegister('DSG');
              }
            }}
            mt='48px'
          >
            <Text fontSize='20px' bold>
              {t('Confirm and Pay')}
            </Text>
          </Button>
        ) : (
          <ApproveButton
            mt='58px'
            erc20Token={token}
            spender={getUserAgentAddress()}
            onFinish={() => {
              if (account && token) {
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
