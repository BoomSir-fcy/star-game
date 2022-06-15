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
import { fetchPlanetBuildingsAsync } from 'state/buildling/fetchers';
import random from 'lodash/random';
import { signMessage } from 'utils/web3React';
import useActiveWeb3React from 'hooks/useActiveWeb3React';

const ButtonStyled = styled(Button)`
  position: absolute;
  top: 9px;
  right: 10px;
  width: 80px;
  height: 45px;
  padding: 10px 15px;
  font-size: 20px;
`;

enum StoreType {
  STONE = 1,
  POPULATION = 2,
  ENERGY = 3,
}

export const RechargeAssets: React.FC<{
  planet_id: number;
  visible: boolean;
  onClose: () => void;
  onFinish?: () => void;
}> = ({ planet_id, visible, onClose }) => {
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
  const [selectId, setSelectId] = useState(StoreType.STONE);
  const [inputValue, setInputValue] = useState('');
  const [pending, setPending] = useState(false);

  // 获取储物罐最大充值金额
  const getStoreData = useCallback(async () => {
    try {
      const res = await Api.BuildingApi.getMaxReCharge(planet_id);
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
  }, [planet_id]);

  const { account, library } = useActiveWeb3React();

  // 充值
  const handleCharge = useCallback(
    async e => {
      if (!inputValue) return;
      const val = Number(inputValue);
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
        const params: Api.Building.StoreRechargeParams = {
          planet_id,
          ...sign,
          signature,
        };
        if (selectId === StoreType.STONE) params.stone = val;
        if (selectId === StoreType.POPULATION) params.population = val;
        if (selectId === StoreType.ENERGY) params.energy = val;
        const res = await Api.BuildingApi.storeReCharge(params);
        if (Api.isSuccess(res)) {
          toastSuccess(t('Recharge Succeeded'));
          setInputValue('');
          getStoreData();
          dispatch(fetchPlanetInfoAsync([planet_id]));
          dispatch(fetchPlanetBuildingsAsync(planet_id));
        }
        setPending(false);
      } catch (error) {
        console.error(error);
        toastError(t('Recharge failed'));
        setPending(false);
      }
    },
    [
      inputValue,
      library,
      account,
      planet_id,
      selectId,
      toastSuccess,
      t,
      getStoreData,
      dispatch,
      toastError,
    ],
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
        <Flex justifyContent='space-between'>
          <Text small>{t('Planet storage tank')}</Text>
          <Flex alignItems='center'>
            <Text fontSize='30px' bold>
              {store[selectId]?.already}
            </Text>
            <Text small color='textSubtle' ml='14px'>
              / {store[selectId]?.max}
            </Text>
          </Flex>
        </Flex>
        <Select
          options={selectOptions}
          mb='27px'
          defaultId={selectId}
          onChange={option => {
            setSelectId(option.value);
            setInputValue('');
          }}
        />
        <Flex position='relative'>
          <PrimaryInput
            width='100%'
            height={65}
            pattern='^[0-9]*[.,]?[0-9]{0,18}$'
            placeholder={t('Please enter the recharge amount')}
            value={inputValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const val = e.target.value;
              const valNum = Number(val);
              const rechargeNum = store[selectId].max - store[selectId].already;
              if (val === '' || e.currentTarget.validity.valid) {
                if (selectId === StoreType.STONE && valNum > rechargeNum)
                  return;
                if (selectId === StoreType.POPULATION && valNum > rechargeNum)
                  return;
                if (selectId === StoreType.ENERGY && valNum > rechargeNum)
                  return;
                setInputValue(val);
              }
            }}
          />
          <ButtonStyled
            onClick={() => {
              setInputValue(
                (store[selectId]?.max - store[selectId]?.already).toString(),
              );
            }}
          >
            {t('MAX')}
          </ButtonStyled>
        </Flex>
        <Flex justifyContent='center' mt='29px'>
          <Button disabled={pending} width={270} onClick={handleCharge}>
            {t('Confirm Recharge')}
          </Button>
        </Flex>
      </Box>
    </ModalWrapper>
  );
};
