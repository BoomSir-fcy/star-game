import React from 'react';
import { Flex, Box, Text, Image } from 'uikit';
import { useTranslation } from 'contexts/Localization';

export const PlanetDesc: React.FC<{
  info: Api.Planet.PlanetInfo;
}> = React.memo(({ info }) => {
  const { t } = useTranslation();

  return (
    <Flex width='100%' flexDirection='column'>
      <Flex flex={1} margin='3px 0'>
        <Text color='textSubtle' small>
          {t('Plunder speed')}:{info?.plunder_speed}
        </Text>
        <Text color='textSubtle' ml='140px' small>
          {t('Buildings')}:{info?.build_count}
        </Text>
      </Flex>
      <Flex justifyContent='space-between' flex={1}>
        <Flex alignItems='center'>
          <Box width={50} height={50} mr='5px'>
            <Image src='/images/commons/icon/ore.png' width={50} height={50} />
          </Box>
          <Flex flexDirection='column' justifyContent='center'>
            <Text color='textTips' small>
              {t('Ore')}
            </Text>
            <Text small>{info?.stone}</Text>
          </Flex>
        </Flex>
        <Flex alignItems='center'>
          <Box width={50} height={50} mr='5px'>
            <Image
              src='/images/commons/icon/population.png'
              width={50}
              height={50}
            />
          </Box>
          <Flex flexDirection='column' justifyContent='center'>
            <Text color='textTips' small>
              {t('Population')}
            </Text>
            <Text small>{info?.population}</Text>
          </Flex>
        </Flex>
        <Flex alignItems='center'>
          <Box width={50} height={50} mr='5px'>
            <Image
              src='/images/commons/icon/energy.png'
              width={50}
              height={50}
            />
          </Box>
          <Flex flexDirection='column' justifyContent='center'>
            <Text color='textTips' small>
              {t('Energy')}
            </Text>
            <Text small>{info?.energy}</Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
});
