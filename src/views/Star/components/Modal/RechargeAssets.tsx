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

const SelectBox = styled(Flex)`
  height: 65px;
  padding: 8px 16px;
  margin-bottom: 27px;
  background: #161920;
  border: 2px solid #282a2e;
  box-shadow: 0px 3px 2px 0px rgba(0, 0, 0, 0.35);
  border-radius: ${({ theme }) => theme.radii.card};
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
}> = ({ planet_id, visible, onClose }) => {
  const dispatch = useDispatch();
  const { toastSuccess, toastError } = useToast();
  const { t } = useTranslation();
  const selectOptions = useMemo(() => {
    return [
      {
        value: StoreType.STONE,
        label: '矿石',
        icon: (
          <Image
            mr='15px'
            width={50}
            height={50}
            src='/images/commons/icon/ore.png'
            alt=''
          />
        ),
      },
      {
        value: StoreType.POPULATION,
        label: '人口',
        icon: (
          <Image
            mr='15px'
            width={50}
            height={50}
            src='/images/commons/icon/population.png'
            alt=''
          />
        ),
      },
      {
        value: StoreType.ENERGY,
        label: '能量',
        icon: (
          <Image
            mr='15px'
            width={50}
            height={50}
            src='/images/commons/icon/energy.png'
            alt=''
          />
        ),
      },
    ];
  }, []);

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
      console.log(error);
    }
  }, [planet_id]);

  // 充值
  const handleCharge = useCallback(
    async e => {
      if (!inputValue) return;
      const val = Number(inputValue);
      try {
        setPending(true);
        const params: Api.Building.StoreRechargeParams = { planet_id };
        if (selectId === StoreType.STONE) params.stone = val;
        if (selectId === StoreType.POPULATION) params.population = val;
        if (selectId === StoreType.ENERGY) params.energy = val;
        const res = await Api.BuildingApi.storeReCharge(params);
        if (Api.isSuccess(res)) {
          toastSuccess(t('充值成功'));
          setInputValue('');
          getStoreData();
          dispatch(fetchPlanetInfoAsync([planet_id]));
        }
        setPending(false);
      } catch (error) {
        console.log(error);
        toastError(t('充值失败'));
        setPending(false);
      }
    },
    [planet_id, selectId, inputValue],
  );

  useEffect(() => {
    if (visible) getStoreData();
  }, [getStoreData, visible]);
  return (
    <ModalWrapper title='补充资源' visible={visible} setVisible={onClose}>
      <Box padding='30px 25px'>
        <Flex justifyContent='space-between'>
          <Text small>星球储存罐</Text>
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
            console.log('111111');

            setSelectId(option.value);
          }}
        />
        <PrimaryInput
          width='100%'
          height={65}
          pattern='^[1-9]\d*$'
          placeholder='请输入充值数量'
          value={inputValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const val = e.target.value;
            const valNum = Number(val);
            const rechargeNum = store[selectId].max - store[selectId].already;
            if (val === '' || e.currentTarget.validity.valid) {
              if (selectId === StoreType.STONE && valNum > rechargeNum) return;
              if (selectId === StoreType.POPULATION && valNum > rechargeNum)
                return;
              if (selectId === StoreType.ENERGY && valNum > rechargeNum) return;
              setInputValue(val);
            }
          }}
        />
        <Flex justifyContent='center' mt='29px'>
          <Button disabled={pending} width={270} onClick={handleCharge}>
            确认充值
          </Button>
        </Flex>
      </Box>
    </ModalWrapper>
  );
};
