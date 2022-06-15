import React, { useMemo } from 'react';
import { Box, Flex, Text, Image } from 'uikit';
import styled from 'styled-components';
import { useStore } from 'state/util';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'contexts/Localization';
import { getFullDisplayBalance } from 'utils/formatBalance';

const Addition = () => {
  const { t } = useTranslation();
  const { alliance, energy } = useStore(p => p.alliance.allianceView);
  const AdditionList = useMemo(() => {
    const arr = [
      {
        type: 1,
        name: t('Ore'),
        total: energy.total_stone,
        capacity: energy.per_stone,
        speed: new BigNumber(energy.per_stone).minus(
          alliance.beforeStoneCap || 0,
        ),
      },
      {
        type: 2,
        name: t('Population'),
        total: energy.total_population,
        capacity: energy.per_population,
        speed: new BigNumber(energy.per_population).minus(
          alliance.beforePopulationCap || 0,
        ),
      },
      {
        type: 3,
        name: t('Energy'),
        total: energy.total_energy,
        capacity: energy.per_energy,
        speed: new BigNumber(energy.per_energy).minus(
          alliance.beforeEnergyCap || 0,
        ),
      },
    ];
    return arr;
  }, [alliance, energy, t]);

  return (
    <Flex
      flex='1'
      flexDirection='column'
      justifyContent='space-between'
      padding='15px 10px'
    >
      {AdditionList.map(item => (
        <ItemRow key={item.type} info={item} />
      ))}
    </Flex>
  );
};

interface AdditionInfo {
  type: number;
  name: string;
  total: number;
  capacity: number;
  speed: BigNumber;
}

const ItemRow: React.FC<{
  info: AdditionInfo;
}> = ({ info }) => {
  const { t } = useTranslation();

  return (
    <Flex alignItems='flex-end'>
      <Flex flex='1'>
        <Image
          src={`/images/commons/icon/${
            info.type === 1 ? 'ore' : info.type === 2 ? 'population' : 'energy'
          }.png`}
          width={60}
          height={62}
        />
        <Box ml='24px'>
          <Text fontSize='22px'>
            {info.name}: {info.total}
          </Text>
          <Text fontSize='22px'>
            {t('Capacity')}:{' '}
            {getFullDisplayBalance(new BigNumber(info.capacity), 0, 1)}/s
          </Text>
        </Box>
      </Flex>
      <Text fontSize='22px' color='profit'>
        {info.speed.toNumber() >= 0 && '+'}
        {getFullDisplayBalance(info.speed, 0, 1)}/s
      </Text>
    </Flex>
  );
};

export default Addition;
