import React from 'react';
import { Flex, Box, Text, Image } from 'uikit';
import { useTranslation } from 'contexts/Localization';
import {
  formatDisplayApr,
  formatLocalisedCompactBalance,
} from 'utils/formatBalance';

export const PlanetDesc: React.FC<{
  info: Api.Planet.PlanetInfo;
}> = React.memo(({ info }) => {
  const { t } = useTranslation();

  return (
    <Flex width='70%' flexDirection='column'>
      <Flex justifyContent='space-between' style={{ minWidth: 0 }}>
        <Flex alignItems='center' style={{ width: 'calc(100% / 3)' }}>
          <Box width={50} height={50} mr='5px'>
            <Image
              src='/images/commons/icon/icon_minera.png'
              width={50}
              height={50}
            />
          </Box>
          <Flex
            flexDirection='column'
            justifyContent='center'
            style={{ width: 'calc(100% - 55px)' }}
          >
            <Text color='textTips'>{t('Ore')}</Text>
            <Flex>
              <Text bold>
                {formatLocalisedCompactBalance(info?.stone)}/
                {formatLocalisedCompactBalance(info?.max_stone)}
              </Text>
              <Text bold ml='6px' color='#3ED450'>
                +{formatLocalisedCompactBalance(info?.oreYield)}/s
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <Flex alignItems='center' style={{ width: 'calc(100% / 3)' }}>
          <Box width={50} height={50} mr='5px'>
            <Image
              src='/images/commons/icon/icon_spice.png'
              width={50}
              height={50}
            />
          </Box>
          <Flex
            flexDirection='column'
            justifyContent='center'
            style={{ width: 'calc(100% - 55px)' }}
          >
            <Text color='textTips'>{t('Population')}</Text>
            <Flex>
              <Text bold>
                {formatLocalisedCompactBalance(info?.population)}/
                {formatLocalisedCompactBalance(info?.max_population)}
              </Text>
              <Text bold ml='6px' color='#3ED450'>
                +{formatLocalisedCompactBalance(info?.populationYield)}/s
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <Flex alignItems='center' style={{ width: 'calc(100% / 3)' }}>
          <Box width={50} height={50} mr='5px'>
            <Image
              src='/images/commons/icon/icon_energy.png'
              width={50}
              height={50}
            />
          </Box>
          <Flex
            flexDirection='column'
            justifyContent='center'
            style={{ width: 'calc(100% - 55px)' }}
          >
            <Text color='textTips'>{t('Energy')}</Text>
            <Flex>
              <Text bold>
                {formatLocalisedCompactBalance(info?.energy)}/
                {formatLocalisedCompactBalance(info?.max_energy)}
              </Text>
              <Text bold ml='6px' color='#3ED450'>
                +{formatLocalisedCompactBalance(info?.energyYield)}/s
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
});
