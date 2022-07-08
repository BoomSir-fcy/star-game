import React from 'react';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import { useImmer } from 'use-immer';
import { Flex, Box, GraphicsCard, Button, MarkText, Text, Image } from 'uikit';

import { formatDisplayApr } from 'utils/formatBalance';
import { useTranslation } from 'contexts/Localization';
import { useToast } from 'contexts/ToastsContext';
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
  const [state, setState] = useImmer({
    stone: 0,
    population: 0,
    energy: 0,
  });
  const stoneProportion = Number(
    (
      (maxValue[StoreType.STONE].already / maxValue[StoreType.STONE].max) *
      100
    ).toFixed(0),
  );
  const populationProportion = Number(
    (
      (maxValue[StoreType.POPULATION].already /
        maxValue[StoreType.POPULATION].max) *
      100
    ).toFixed(0),
  );
  const energyProportion = Number(
    (
      (maxValue[StoreType.ENERGY].already / maxValue[StoreType.ENERGY].max) *
      100
    ).toFixed(2),
  );

  React.useEffect(() => {
    if (Object.keys(maxValue).length > 0) {
      console.log('Object.keys(maxValue): ', Object.keys(maxValue), maxValue);
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
    <Container width='547px' height='343px'>
      <Box position='relative'>
        <Close onClick={onClose}>
          <Image
            width={43}
            height={43}
            src='../images/commons/introjs-close.png'
          />
        </Close>
        <MarkText bold fontStyle='normal' mb='25px'>
          {t('Supplement Resources')}
        </MarkText>
        <Box mb='21px'>
          <ResourceSlider
            icon='ORE'
            title={t('Ore')}
            defaultValue={state.stone}
            maxValue={maxValue[StoreType.STONE].max}
            onChange={val => {
              if (val < stoneProportion) return;
              setState(p => {
                p.stone = Number(val.toFixed(0));
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
              if (val < energyProportion) return;
              setState(p => {
                p.energy = Number(val.toFixed(0));
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
              if (val < populationProportion) return;
              setState(p => {
                p.population = Number(val.toFixed(0));
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
                state.energy === 100 &&
                state.stone === 100 &&
                state.population === 100
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
                        (
                          ((state.stone - stoneProportion) / 100) *
                          maxValue[StoreType.STONE].max
                        ).toFixed(0),
                      ),
                population:
                  state.population === 100
                    ? maxValue[StoreType.POPULATION].max -
                      maxValue[StoreType.POPULATION].already
                    : Number(
                        (
                          ((state.population - populationProportion) / 100) *
                          maxValue[StoreType.POPULATION].max
                        ).toFixed(0),
                      ),
                energy:
                  state.energy === 100
                    ? maxValue[StoreType.ENERGY].max -
                      maxValue[StoreType.ENERGY].already
                    : Number(
                        (
                          ((state.energy - energyProportion) / 100) *
                          maxValue[StoreType.ENERGY].max
                        ).toFixed(0),
                      ),
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
