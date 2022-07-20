import React, { useState } from 'react';
import {
  Flex,
  Box,
  Text,
  Button,
  GraphicsCard,
  MarkText,
  Image,
  Dots,
} from 'uikit';
import { useTranslation } from 'contexts/Localization';
import { Link } from 'react-router-dom';
import ModalWrapper from 'components/Modal';
import { useToast } from 'contexts/ToastsContext';
import { Api } from 'apis';
import { TokenImage } from 'components/TokenImage';
import { useDispatch } from 'react-redux';
import { storeAction, useStore } from 'state';
import BigNumber from 'bignumber.js';

export const ConfirmBuyModule: React.FC<{
  visible: boolean;
  onClose: () => void;
  buy: () => void;
  vipPrice: string;
  Renewal: boolean;
}> = ({ visible, onClose, buy, vipPrice, Renewal }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { toastError } = useToast();

  const Balance = useStore(p => p.userInfo.userBalance);
  const [pending, setpending] = useState(false);

  const BNBBlance = React.useMemo(() => {
    const balance = Balance.filter(item => {
      return item.symbol === 'BNB';
    });
    return balance[0].amount;
  }, [Balance]);

  return (
    <ModalWrapper title='Tips' visible={visible} setVisible={onClose}>
      <Flex flexDirection='column' alignItems='center' padding='30px 25px'>
        <Flex
          mb='26px'
          width='100%'
          alignItems='center'
          justifyContent='center'
        >
          <TokenImage width={30} height={30} tokenAddress='BNB' />
          <Text margin='0 10px' fontSize='22px'>
            BNB
          </Text>
          <MarkText fontSize='22px' bold fontStyle='normal'>
            $ {vipPrice}
          </MarkText>
        </Flex>
        <GraphicsCard
          style={{ padding: '10px' }}
          width='90%'
          height='max-content'
          stripe
          isRadius
        >
          <Flex alignItems='center' justifyContent='space-between'>
            <Flex flex={1} alignItems='center'>
              <TokenImage width={30} height={30} tokenAddress='BNB' />
              <Text margin='0 10px' fontSize='22px'>
                BNB
              </Text>
              <Text fontSize='22px' pl='10px'>
                {t('Balance')} : {BNBBlance}
              </Text>
            </Flex>
            <Flex alignItems='center' width='154px'>
              <Text margin='0 10px' fontSize='22px' color='#4FFFFB'>
                {t('Recharge')}
              </Text>
              <Image
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
            </Flex>
          </Flex>
        </GraphicsCard>
        <Flex justifyContent='space-between' mt='60px'>
          <Button
            width='300px'
            variant='purple'
            disabled={pending}
            onClick={() => {
              if (new BigNumber(BNBBlance).isLessThan(vipPrice)) {
                toastError(t('Insufficient_BNB'));
                return;
              }
              setpending(true);
              buy();
            }}
          >
            <Text
              bold
              fontSize='18px'
              color='#4FFFFB'
              textTransform='capitalize'
            >
              {pending ? (
                <Dots>{Renewal ? t('Renewal') : t('Become VIP')}</Dots>
              ) : (
                <>{Renewal ? t('Renewal') : t('Become VIP')}</>
              )}
            </Text>
          </Button>
        </Flex>
      </Flex>
    </ModalWrapper>
  );
};
