import React, { Fragment, useCallback, useMemo, useState } from 'react';
import {
  RefreshButton,
  Flex,
  Box,
  BackButton,
  Image,
  Text,
  BoxProps,
  Progress,
} from 'uikit';
import styled from 'styled-components';
import { useTranslation } from 'contexts/Localization';
import { PlanetProView } from 'state/types';
import { QualityColor } from 'uikit/theme/colors';
import { getPlanetRarity } from 'utils/planetRarity';
import { PlanetBall } from 'components';
import { formatLocalisedCompactBalance } from 'utils/formatBalance';
import ResourceInfoBox from './ResourceInfoBox';

interface PlanetProgressProps extends BoxProps {
  info: PlanetProView;
  WorkEnd: boolean;
}

const PlanetProgress: React.FC<PlanetProgressProps> = ({
  info,
  WorkEnd,
  ...props
}) => {
  const { t, getHTML } = useTranslation();

  const ResourceProgress = useMemo(() => {
    const ResourceInfo = [
      {
        img: 'icon_minera',
        Protect: info?.protect_stone,
        now: info?.stone,
        max: info?.max_stone,
        sec: info?.sec_stone,
      },
      {
        img: 'icon_energy',
        Protect: info?.protect_energy,
        now: info?.energy,
        max: info?.max_energy,
        sec: info?.sec_energy,
      },
      {
        img: 'icon_spice',
        Protect: info?.protect_spices,
        now: info?.spices,
        max: info?.max_spices,
        sec: info?.sec_spices,
      },
    ];

    return ResourceInfo;
  }, [info]);

  return (
    <Flex width={568} height={140} mb='40px' {...props}>
      <Flex
        height='100%'
        flexDirection='column'
        justifyContent='space-between'
        width='24%'
      >
        <Flex justifyContent='space-around' alignItems='center'>
          <Text fontSize='16px' color={QualityColor[info?.rarity]} bold>
            {t(getPlanetRarity(info?.rarity))}
          </Text>
          <Text mark fontSize='16px' style={{ whiteSpace: 'nowrap' }} bold>
            Lv {info?.level}
          </Text>
        </Flex>
        <Flex flex={1} justifyContent='center' alignItems='center'>
          <PlanetBall
            rotate
            scale='sm'
            shadow={QualityColor[info?.rarity]}
            url={info?.picture1}
          />
        </Flex>
      </Flex>
      <Flex
        height='100%'
        flexDirection='column'
        justifyContent='space-between'
        flex={1}
        ml='10px'
      >
        {(ResourceProgress || []).map(reItem => (
          <ResourceInfoBox key={reItem.img} reItem={reItem} WorkEnd={WorkEnd} />
        ))}
      </Flex>
    </Flex>
  );
};

export default PlanetProgress;
