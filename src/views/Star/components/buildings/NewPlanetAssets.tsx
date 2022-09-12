import React from 'react';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';

import { formatDisplayApr } from 'utils/formatBalance';
import { Flex, Box, Text, MarkText } from 'uikit';
import { useTranslation } from 'contexts/Localization';
import { TokenImage } from 'components/TokenImage';
import { PlanetDesc } from 'views/NewPlanet/components/PlanetDesc';
import { BarRightWarp } from './barRightWarp';

export const NewPlanetAssets: React.FC<{
  plant_info: Api.Planet.PlanetInfo;
  current_buff?: Api.Building.BuildingBuffer;
}> = ({ plant_info, current_buff }) => {
  const { t } = useTranslation();

  return (
    <BarRightWarp>
      <Flex
        height='100%'
        width='100%'
        justifyContent='space-between'
        alignItems='flex-start'
      >
        <Flex
          flexDirection='column'
          justifyContent='space-between'
          height='100%'
          width='50%'
        >
          <Flex alignItems='baseline'>
            <MarkText padding={0} bold fontStyle='normal' color='textSubtle'>
              {t('Production')}
            </MarkText>
          </Flex>
          <PlanetDesc info={plant_info} />
        </Flex>
        <Flex
          flexDirection='column'
          justifyContent='space-between'
          height='100%'
          width='45%'
        >
          <MarkText padding={0} fontStyle='normal' bold>
            {t('Battle Attribute')}
          </MarkText>
          <Box>
            <Text small color='textSubtle'>
              {t('Building Count')}
            </Text>
            <Text small>{plant_info?.build_count}</Text>
          </Box>
          <Box>
            <Text small color='textSubtle'>
              {t('Biohack')}
            </Text>
            <Text small>
              {t('Power')} +{plant_info?.ak_buff}
            </Text>
          </Box>
          <Box>
            <Text small color='textSubtle'>
              {t('Planet Cultivation')}
            </Text>
            <Text small>
              {t('Power')} +{plant_info?.strengthen_buff}
            </Text>
          </Box>
          <Text small ellipsis>
            {t('Token')} {plant_info?.id}
          </Text>
        </Flex>
      </Flex>
    </BarRightWarp>
  );
};
