import React from 'react';
import { Flex, Box, Text, Image } from 'uikit';
import { useTranslation } from 'contexts/Localization';

export const PlanetDesc: React.FC<{
  info: Api.Planet.PlanetInfo;
}> = React.memo(({ info }) => {
  const { t } = useTranslation();

  return (
    <Flex width='100%' flexDirection='column'>
      {/* <Flex flex={1} margin='3px 0'>
        <Text color='textSubtle' small>
          {t('Looting Speed')}: {info?.plunder_speed}
        </Text>
        <Text color='textSubtle' ml='140px' small>
          {t('Building Count')}: {info?.build_count}
        </Text>
      </Flex> */}
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
            <Text color='textTips' small>
              {t('Ore')}
            </Text>
            <Text small ellipsis>
              {info?.stone}
            </Text>
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
            <Text color='textTips' small>
              {t('Population')}
            </Text>
            <Text small ellipsis>
              {info?.population}
            </Text>
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
            <Text color='textTips' small>
              {t('Energy')}
            </Text>
            <Text small ellipsis>
              {info?.energy}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
});
