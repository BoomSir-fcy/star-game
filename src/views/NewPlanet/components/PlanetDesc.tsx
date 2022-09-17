import React from 'react';
import { Flex, Box, Text, Image } from 'uikit';
import { useTranslation } from 'contexts/Localization';
import { formatLocalisedCompactBalance } from 'utils/formatBalance';
import { SubString_1 } from 'utils/DecimalPlaces';

export const PlanetDesc: React.FC<{
  info: Api.Planet.PlanetInfo;
}> = React.memo(({ info }) => {
  const { t } = useTranslation();

  return (
    <Flex flexDirection='column' justifyContent='space-between'>
      <Flex mb='14px' alignItems='center'>
        <Box width={50} height={50} mr='5px'>
          <Image
            src='/images/commons/icon/icon_minera.png'
            width={50}
            height={50}
          />
        </Box>
        <Flex flexDirection='column' justifyContent='center' flex={1}>
          <Flex>
            <Text color='textTips' small mr='4px'>
              {t('Capacity')}
            </Text>
            <Text small ml='6px'>
              +{SubString_1(info?.oreYield, 3)}/s
            </Text>
          </Flex>
          <Flex>
            <Text color='textTips' small mr='4px'>
              {t('Ore')}
            </Text>
            <Text small ellipsis>
              {formatLocalisedCompactBalance(info?.stone)}/
              {formatLocalisedCompactBalance(info?.max_stone)}
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <Flex mb='14px' alignItems='center'>
        <Box width={50} height={50} mr='5px'>
          <Image
            src='/images/commons/icon/icon_spice.png'
            width={50}
            height={50}
          />
        </Box>
        <Flex flexDirection='column' justifyContent='center' flex={1}>
          <Flex>
            <Text color='textTips' small mr='4px'>
              {t('Capacity')}
            </Text>
            <Text small ml='6px'>
              +{SubString_1(info?.populationYield, 3)}/s
            </Text>
          </Flex>
          <Flex>
            <Text color='textTips' small mr='4px'>
              {t('Population')}
            </Text>
            <Text small ellipsis>
              {formatLocalisedCompactBalance(info?.population)}/
              {formatLocalisedCompactBalance(info?.max_population)}
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <Flex alignItems='center'>
        <Box width={50} height={50} mr='5px'>
          <Image
            src='/images/commons/icon/icon_energy.png'
            width={50}
            height={50}
          />
        </Box>
        <Flex flexDirection='column' justifyContent='center' flex={1}>
          <Flex>
            <Text color='textTips' small mr='4px'>
              {t('Capacity')}
            </Text>
            <Text small ml='6px'>
              +{SubString_1(info?.energyYield, 3)}/s
            </Text>
          </Flex>
          <Flex>
            <Text color='textTips' small mr='4px'>
              {t('Energy')}
            </Text>
            <Text small ellipsis>
              {formatLocalisedCompactBalance(info?.energy)}/
              {formatLocalisedCompactBalance(info?.max_energy)}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
});
