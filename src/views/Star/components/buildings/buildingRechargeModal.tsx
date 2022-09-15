import React, { useMemo } from 'react';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import { useImmer } from 'use-immer';
import { Flex, Box, GraphicsCard, Button, MarkText, Text, Image } from 'uikit';

import { useStore, storeAction } from 'state';
import { formatDisplayApr } from 'utils/formatBalance';
import { useTranslation } from 'contexts/Localization';
import { useToast } from 'contexts/ToastsContext';
import { useDispatch } from 'react-redux';
import { SubString_1 } from 'utils/DecimalPlaces';
import { ResourceSlider } from './buildingResourceModal';

const Container = styled(GraphicsCard)`
  position: absolute;
  right: 580px;
  bottom: 50px;
  padding: 20px 30px;
`;

const Close = styled(Box)`
  position: absolute;
  top: -10px;
  right: -20px;
  width: 43px;
  height: 43px;
  cursor: pointer;
`;

enum StoreType {
  STONE = 1,
  POPULATION = 2,
  ENERGY = 3,
}

export const BuildingRechargeModal: React.FC<{
  type: number;
  maxValue: any;
  defaultValue: {
    stone: number;
    population: number;
    energy: number;
  };
  onClose: () => void;
  onFinish: (prams) => void;
}> = ({ type, maxValue, defaultValue, onClose, onFinish }) => {
  const { t } = useTranslation();
  const { toastError } = useToast();
  const dispatch = useDispatch();

  const Product = useStore(p => p.userInfo.userProduct);
  const guideState = useStore(p => p.guide);

  const [state, setState] = useImmer({
    stone: 0,
    population: 0,
    energy: 0,
  });
  const stoneProportion = Number(
    SubString_1(
      Number(
        new BigNumber(maxValue[StoreType.STONE].already)
          .div(maxValue[StoreType.STONE].max)
          .times(100),
      ),
      50,
    ),
  );
  const populationProportion = Number(
    SubString_1(
      Number(
        new BigNumber(maxValue[StoreType.POPULATION].already)
          .div(maxValue[StoreType.POPULATION].max)
          .times(100),
      ),
      50,
    ),
  );
  const energyProportion = Number(
    SubString_1(
      Number(
        new BigNumber(maxValue[StoreType.ENERGY].already)
          .div(maxValue[StoreType.ENERGY].max)
          .times(100),
      ),
      50,
    ),
  );

  const OreBalanceProportion = useMemo(() => {
    return SubString_1(
      Number(
        new BigNumber(Product.stone)
          .plus(maxValue[StoreType.STONE].already)
          .div(maxValue[StoreType.STONE].max)
          .times(100),
      ),
      50,
    );
  }, [Product, maxValue]);

  const ENEBalanceProportion = useMemo(() => {
    return SubString_1(
      Number(
        new BigNumber(Product.energy)
          .plus(maxValue[StoreType.ENERGY].already)
          .div(maxValue[StoreType.ENERGY].max)
          .times(100),
      ),
      50,
    );
  }, [Product, maxValue]);

  const POPBalanceProportion = useMemo(() => {
    return SubString_1(
      Number(
        new BigNumber(Product.population)
          .plus(maxValue[StoreType.POPULATION].already)
          .div(maxValue[StoreType.POPULATION].max)
          .times(100),
      ),
      50,
    );
  }, [Product, maxValue]);

  React.useEffect(() => {
    if (Object.keys(maxValue).length > 0) {
      setState(p => {
        p.stone =
          (maxValue[StoreType.STONE].already / maxValue[StoreType.STONE].max) *
          100;
        p.population =
          (maxValue[StoreType.POPULATION].already /
            maxValue[StoreType.POPULATION].max) *
          100;
        p.energy =
          (maxValue[StoreType.ENERGY].already /
            maxValue[StoreType.ENERGY].max) *
          100;
      });
    }
  }, [setState, maxValue]);

  return (
    <Container width='547px' height='370px'>
      <Box position='relative'>
        <Close onClick={onClose}>
          <Image
            width={43}
            height={43}
            src='../images/commons/introjs-close.png'
          />
        </Close>
        <MarkText bold fontStyle='normal'>
          {t('Supplement Resources')}
        </MarkText>
        <Text pt='10px' small color='textTips' mb='20px'>
          {t('The total amount of resources on the planet')}
        </Text>
        <Box mb='21px'>
          <ResourceSlider
            icon='ORE'
            title={t('Ore')}
            defaultValue={state.stone}
            maxValue={maxValue[StoreType.STONE].max}
            onChange={val => {
              if (val < stoneProportion) {
                setState(p => {
                  p.stone = Number(stoneProportion);
                });
                return;
              }
              if (val >= OreBalanceProportion) {
                if (
                  !guideState.recharge_visible &&
                  stoneProportion === OreBalanceProportion
                ) {
                  dispatch(
                    storeAction.toggleRechargeVisible({ visible: true }),
                  );
                }
                setState(p => {
                  p.stone = Number(OreBalanceProportion);
                });
                return;
              }
              setState(p => {
                p.stone = Number(SubString_1(val, 50));
              });
            }}
          />
        </Box>
        <Box mb='21px'>
          <ResourceSlider
            icon='ENG'
            title={t('Energy')}
            defaultValue={state.energy}
            maxValue={maxValue[StoreType.ENERGY].max}
            onChange={val => {
              if (val < energyProportion) {
                setState(p => {
                  p.energy = Number(energyProportion);
                });
                return;
              }
              if (val >= ENEBalanceProportion) {
                if (
                  !guideState.recharge_visible &&
                  energyProportion === ENEBalanceProportion
                ) {
                  dispatch(
                    storeAction.toggleRechargeVisible({ visible: true }),
                  );
                }
                setState(p => {
                  p.energy = Number(ENEBalanceProportion);
                });
                return;
              }
              setState(p => {
                p.energy = Number(SubString_1(val, 50));
              });
            }}
          />
        </Box>
        <Box>
          <ResourceSlider
            icon='SPICES'
            title={t('Population')}
            defaultValue={state.population}
            maxValue={maxValue[StoreType.POPULATION].max}
            onChange={val => {
              if (val < populationProportion) {
                setState(p => {
                  p.population = Number(populationProportion);
                });
                return;
              }
              if (val >= POPBalanceProportion) {
                if (
                  !guideState.recharge_visible &&
                  populationProportion === POPBalanceProportion
                ) {
                  dispatch(
                    storeAction.toggleRechargeVisible({ visible: true }),
                  );
                }
                setState(p => {
                  p.population = Number(POPBalanceProportion);
                });
                return;
              }
              setState(p => {
                p.population = Number(SubString_1(val, 50));
              });
            }}
          />
        </Box>
        <Flex justifyContent='center' mt='15px'>
          <Button
            width='226px'
            height='53px'
            variant='purple'
            onClick={() => {
              if (
                defaultValue.energy === maxValue[StoreType.ENERGY].max &&
                defaultValue.stone === maxValue[StoreType.STONE].max &&
                defaultValue.population === maxValue[StoreType.POPULATION].max
              ) {
                toastError(
                  t(
                    'The resource has reached the upper limit and cannot be recharged',
                  ),
                );
                return;
              }

              const params = {
                stone:
                  state.stone === 100
                    ? maxValue[StoreType.STONE].max -
                      maxValue[StoreType.STONE].already
                    : Number(
                        ((state.stone - stoneProportion) / 100) *
                          maxValue[StoreType.STONE].max,
                      ).toFixed(0),
                population:
                  state.population === 100
                    ? maxValue[StoreType.POPULATION].max -
                      maxValue[StoreType.POPULATION].already
                    : Number(
                        ((state.population - populationProportion) / 100) *
                          maxValue[StoreType.POPULATION].max,
                      ).toFixed(0),

                energy:
                  state.energy === 100
                    ? maxValue[StoreType.ENERGY].max -
                      maxValue[StoreType.ENERGY].already
                    : Number(
                        ((state.energy - energyProportion) / 100) *
                          maxValue[StoreType.ENERGY].max,
                      ).toFixed(0),
              };
              onFinish(params);
            }}
          >
            <Text bold fontSize='16px' color='#4FFFFB'>
              {t('Confirm Recharge')}
            </Text>
          </Button>
        </Flex>
      </Box>
    </Container>
  );
};
