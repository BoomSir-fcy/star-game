import React from 'react';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import { useImmer } from 'use-immer';
import { Flex, Box, GraphicsCard, Button, MarkText, Slider, Text } from 'uikit';
import { TokenImage } from 'components/TokenImage';

import { formatDisplayApr } from 'utils/formatBalance';
import { useTranslation } from 'contexts/Localization';
import { ResourceSlider } from './buildingResourceModal';

const Container = styled(GraphicsCard)`
  position: absolute;
  right: 580px;
  bottom: -150px;
  padding: 20px 30px;
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
    setState(p => {
      p.stone = (defaultValue.stone / maxValue[StoreType.STONE].max) * 100;
      p.population =
        (defaultValue.population / maxValue[StoreType.POPULATION].max) * 100;
      p.energy = (defaultValue.energy / maxValue[StoreType.ENERGY].max) * 100;
    });
  }, [defaultValue, setState, maxValue]);

  // React.useEffect(() => {
  //   window.addEventListener('click', onClose);
  //   return () => {
  //     window.removeEventListener('click', onClose);
  //   };
  // }, [onClose]);

  return (
    <Container width='547px' height='343px'>
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
    </Container>
  );
};
