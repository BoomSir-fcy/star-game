import React from 'react';
import random from 'lodash/random';
import { useDispatch } from 'react-redux';
import { useImmer } from 'use-immer';
import { Flex, Box, MarkText, Text, Button } from 'uikit';
import { useStore } from 'state';
import { Api } from 'apis';

import { useToast } from 'contexts/ToastsContext';
import { useTranslation } from 'contexts/Localization';

import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { signMessage } from 'utils/web3React';

import { fetchPlanetInfoAsync } from 'state/planet/fetchers';
import { fetchPlanetBuildingsAsync } from 'state/buildling/fetchers';

import { BuildingDetailType } from 'state/types';
import { BuildingProgress } from './buildingProgress';
import { BuildingResourceModal } from './buildingResourceModal';
import { BuildingRechargeModal } from './buildingRechargeModal';

enum StoreType {
  STONE = 1,
  POPULATION = 2,
  ENERGY = 3,
}

export const BuildingResources: React.FC<{
  planet_id: number;
  currnet_building: Api.Building.BuildingDetail;
  estimate?: Api.Building.BuildingDetail;
  onClose: () => void;
}> = ({ planet_id, currnet_building, estimate, onClose }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { store, cellar } = currnet_building;
  const { toastSuccess, toastError } = useToast();
  const { account, library } = useActiveWeb3React();
  const planet = useStore(p => p.planet.planetInfo[planet_id ?? 0]);
  const [storeAssets, setStoreAssets] = React.useState({
    [StoreType.STONE]: { already: 0, max: 0 },
    [StoreType.POPULATION]: { already: 0, max: 0 },
    [StoreType.ENERGY]: { already: 0, max: 0 },
  });
  const [state, setState] = useImmer({
    visible: false,
    type: 1, // 1充值，2提取
    needMax: {
      stone: 0,
      population: 0,
      energy: 0,
    },
  });

  // 获取储物罐最大充值金额
  const getStoreData = React.useCallback(async () => {
    try {
      const res = await Api.BuildingApi.getMaxReCharge(planet_id);
      if (Api.isSuccess(res)) {
        const info: Api.Building.Store = res.data;
        setState(p => {
          p.visible = true;
          p.type = 1;
          p.needMax.stone = store?.store_stone + store?.charge_stone;
          p.needMax.population =
            store?.store_population + store?.charge_population;
          p.needMax.energy = store?.store_energy + store?.charge_energy;
        });
        setStoreAssets({
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
  }, [planet_id, setState, store]);

  const extractChange = React.useCallback(
    async val => {
      try {
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
          ...val,
        };
        const res = await Api.BuildingApi.storeExtract(params);
        if (Api.isSuccess(res)) {
          setState(p => {
            p.visible = false;
          });
          toastSuccess(t('Recharge Succeeded'));
          onClose();
          dispatch(fetchPlanetInfoAsync([planet_id]));
          dispatch(fetchPlanetBuildingsAsync(planet_id));
        }
      } catch (error) {
        console.log('error: ', error);
      }
    },
    [account, dispatch, library, onClose, planet_id, setState, t, toastSuccess],
  );

  const rechargeChange = React.useCallback(
    async val => {
      try {
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
          ...val,
        };
        const res = await Api.BuildingApi.storeReCharge(params);
        if (Api.isSuccess(res)) {
          setState(p => {
            p.visible = false;
          });
          toastSuccess(t('Recharge Succeeded'));
          onClose();
          dispatch(fetchPlanetInfoAsync([planet_id]));
          dispatch(fetchPlanetBuildingsAsync(planet_id));
        }
      } catch (error) {
        console.log(error);
      }
    },
    [account, dispatch, library, onClose, planet_id, setState, t, toastSuccess],
  );

  return (
    <Box>
      <MarkText bold fontSize='18px' fontStyle='normal' mb='25px'>
        {t('store resources')}
      </MarkText>
      {currnet_building.detail_type ===
        BuildingDetailType.BuildingDetailTypeStore && (
        <Flex width='100%' flexDirection='column'>
          <Box mb='15px'>
            <BuildingProgress
              token='ORE'
              title={t('Ore')}
              value={store?.store_stone + store?.charge_stone}
              nextValue={
                estimate?.store?.store_max_stone - store?.store_max_stone
              }
              progressbar={
                ((store?.store_stone + store?.charge_stone) /
                  store?.store_max_stone) *
                100
              }
            />
          </Box>
          <Box mb='15px'>
            <BuildingProgress
              token='ENG'
              title={t('Energy')}
              value={store?.store_energy + store?.charge_energy}
              nextValue={
                estimate?.store?.store_max_energy - store?.store_max_energy
              }
              progressbar={
                ((store?.store_energy + store?.charge_energy) /
                  store?.store_max_energy) *
                100
              }
            />
          </Box>
          <Box mb='15px'>
            <BuildingProgress
              token='SPICES'
              title={t('Population')}
              value={store?.store_population + store?.charge_population}
              nextValue={
                estimate?.store?.store_max_population -
                store?.store_max_population
              }
              progressbar={
                ((store?.store_population + store?.charge_population) /
                  store?.store_max_population) *
                100
              }
            />
          </Box>
        </Flex>
      )}

      {/* 地窖 */}
      {currnet_building.detail_type ===
        BuildingDetailType.BuildingDetailTypeCellar && (
        <Flex width='100%' flexDirection='column'>
          <Box mb='20px'>
            <BuildingProgress
              token='ORE'
              title={t('Ore')}
              value={cellar?.protect_stone}
              nextValue={
                estimate?.cellar?.protect_stone - cellar?.protect_stone
              }
              progressbar={100}
            />
          </Box>
          <Box mb='20px'>
            <BuildingProgress
              token='ENG'
              title={t('Energy')}
              value={cellar?.protect_energy}
              nextValue={
                estimate?.cellar?.protect_energy - cellar?.protect_energy
              }
              progressbar={100}
            />
          </Box>
          <Box mb='20px'>
            <BuildingProgress
              token='SPICES'
              title={t('Population')}
              value={cellar?.protect_population}
              nextValue={
                estimate?.cellar?.protect_population -
                cellar?.protect_population
              }
              progressbar={100}
            />
          </Box>
        </Flex>
      )}

      {currnet_building.detail_type ===
        BuildingDetailType.BuildingDetailTypeStore && (
        <Flex justifyContent='space-between'>
          <Button
            width='226px'
            height='53px'
            variant='purple'
            onClick={event => {
              event.stopPropagation();
              event.preventDefault();
              getStoreData();
            }}
          >
            <Text bold fontSize='16px' color='#4FFFFB'>
              {t('Supplement Resources')}
            </Text>
          </Button>
          <Button
            width='226px'
            height='53px'
            variant='purple'
            onClick={event => {
              event.stopPropagation();
              event.preventDefault();
              setState(p => {
                p.visible = true;
                p.type = 2;
                p.needMax.stone = planet?.stone;
                p.needMax.population = planet?.population;
                p.needMax.energy = planet?.energy;
              });
            }}
          >
            <Text bold fontSize='16px' color='#4FFFFB'>
              {t('Extract Resources')}
            </Text>
          </Button>
        </Flex>
      )}

      {state.visible && state.type === 1 && (
        <BuildingRechargeModal
          type={state.type}
          defaultValue={state.needMax}
          maxValue={storeAssets}
          onFinish={rechargeChange}
          onClose={() =>
            setState(p => {
              p.visible = false;
            })
          }
        />
      )}

      {/* 充提资源 */}
      {state.visible && state.type === 2 && (
        <BuildingResourceModal
          type={state.type}
          maxValue={state.needMax}
          onFinish={extractChange}
          onClose={() =>
            setState(p => {
              p.visible = false;
            })
          }
        />
      )}
    </Box>
  );
};
