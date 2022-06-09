import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Box, Flex, Input, Button, Text, Image, PrimaryInput } from 'uikit';
import ModalWrapper from 'components/Modal';
import { Select } from 'components/Select';
import { Api } from 'apis';
import { useToast } from 'contexts/ToastsContext';
import { useTranslation } from 'contexts/Localization';
import { useDispatch } from 'react-redux';
import { fetchPlanetInfoAsync } from 'state/planet/fetchers';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import random from 'lodash/random';
import { signMessage } from 'utils/web3React';

const SelectBox = styled(Flex)`
  height: 65px;
  padding: 8px 16px;
  margin-bottom: 27px;
  background: #161920;
  border: 2px solid #282a2e;
  box-shadow: 0px 3px 2px 0px rgba(0, 0, 0, 0.35);
  border-radius: ${({ theme }) => theme.radii.card};
`;

const RechargeFlex = styled(Flex)`
  height: 65px;
  padding: 8px 16px;
  background: ${({ theme }) => theme.colors.input};
  border: 2px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0px 3px 2px 0px rgba(0, 0, 0, 0.35);
  border-radius: ${({ theme }) => theme.radii.card};
`;

enum StoreType {
  STONE = 1,
  POPULATION = 2,
  ENERGY = 3,
}

export const RechargeAssets: React.FC<{
  visible: boolean;
  onClose: () => void;
}> = ({ visible, onClose }) => {
  const dispatch = useDispatch();
  const { toastSuccess, toastError } = useToast();
  const { t } = useTranslation();
  const selectOptions = useMemo(() => {
    return [
      {
        value: StoreType.STONE,
        label: t('Ore'),
        icon: (
          <Image
            mr='15px'
            width={50}
            height={50}
            src='/images/commons/icon/icon_minera.png'
            alt=''
          />
        ),
      },
      {
        value: StoreType.POPULATION,
        label: t('Population'),
        icon: (
          <Image
            mr='15px'
            width={50}
            height={50}
            src='/images/commons/icon/icon_spice.png'
            alt=''
          />
        ),
      },
      {
        value: StoreType.ENERGY,
        label: t('Energy'),
        icon: (
          <Image
            mr='15px'
            width={50}
            height={50}
            src='/images/commons/icon/icon_energy.png'
            alt=''
          />
        ),
      },
    ];
  }, [t]);

  const [store, setStore] = useState({
    [StoreType.STONE]: { already: 0, max: 0 },
    [StoreType.POPULATION]: { already: 0, max: 0 },
    [StoreType.ENERGY]: { already: 0, max: 0 },
  });
  const [pending, setPending] = useState(false);

  const { account, library } = useActiveWeb3React();

  // 获取储物罐最大充值金额
  const getStoreData = useCallback(async () => {
    try {
      const res = await Api.BuildingApi.getAllianceMaxReCharge();
      if (Api.isSuccess(res)) {
        const info: Api.Building.Store = res.data;
        setStore({
          [StoreType.STONE]: {
            already: info.already_stone,
            max: info.max_store,
          },
          [StoreType.POPULATION]: {
            already: info.already_population,
            max: info.max_population,
          },
          [StoreType.ENERGY]: {
            already: info.already_energy,
            max: info.max_energy,
          },
        });
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  // 充值
  const handleCharge = useCallback(
    async e => {
      if (!account) return;

      try {
        setPending(true);
        const sign = {
          nonce: `${random(0xffff, 0xffff_ffff_ffff)}`,
          timestamp: new Date().getTime(),
        };
        const signature = await signMessage(
          library,
          account,
          JSON.stringify(sign),
        );
        const params = { ...sign, signature };

        const res = await Api.BuildingApi.storeAllianceReCharge(params);
        if (Api.isSuccess(res)) {
          toastSuccess(t('Recharge Succeeded'));
          getStoreData();
        }
        setPending(false);
      } catch (error) {
        console.error(error);
        toastError(t('Recharge failed'));
        setPending(false);
      }
    },
    [account, library, t, getStoreData, toastError, toastSuccess],
  );

  useEffect(() => {
    if (visible) getStoreData();
  }, [getStoreData, visible]);
  return (
    <ModalWrapper
      title={t('Supplement Resources')}
      visible={visible}
      setVisible={onClose}
    >
      <Box padding='30px 25px'>
        <Flex mb={28} justifyContent='space-between'>
          {/* <Text small>{t('Planet storage tank')}</Text> */}
          {/* <Flex alignItems='center'>
            <Text fontSize='30px' bold>
              {store[selectId]?.already}
            </Text>
            <Text small color='textSubtle' ml='14px'>
              / {store[selectId]?.max}
            </Text>
          </Flex> */}
        </Flex>
        {selectOptions.map(item => (
          <RechargeFlex
            key={item.value}
            justifyContent='space-between'
            alignItems='center'
            mb='16px'
          >
            <Flex alignItems='center' flex={1}>
              {item.icon}
              <Text ellipsis color='textSubtle' small>
                {item.label}
              </Text>
            </Flex>
            <Flex alignItems='center'>
              <Text fontSize='30px' bold>
                {store[item.value]?.already}
              </Text>
              {/* <Text small color='textSubtle' ml='14px'>
                / {store[item.value]?.max}
              </Text> */}
            </Flex>
          </RechargeFlex>
        ))}
        <Flex justifyContent='center' mt='120px'>
          <Button disabled={pending} width={270} onClick={handleCharge}>
            {t('Confirm Recharge')}
          </Button>
        </Flex>
      </Box>
    </ModalWrapper>
  );
};
