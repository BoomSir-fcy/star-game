import React from 'react';
import { Flex, Box, Text } from 'uikit';
import StarCom from 'components/StarCom';
import ScoringPanel from 'components/ScoringPanel';

import { QualityColor, RaceTypeColor } from 'uikit/theme/colors';
import { getPlanetRarity } from 'utils/planetRarity';
import { useTranslation } from 'contexts/Localization';

export const BarHead: React.FC<{
  plant_info: Api.Planet.PlanetInfo;
}> = ({ plant_info }) => {
  const { t } = useTranslation();
  return (
    <Flex mb='30px'>
      <StarCom
        scale='sm'
        variant='none'
        quality={plant_info?.rarity}
        picture={plant_info?.picture}
        mr='15px'
        showUnion={plant_info?.in_alliance !== 0}
        style={{ flexShrink: 1 }}
      />
      <Flex flexDirection='column' justifyContent='space-between'>
        <Flex alignItems='flex-end'>
          <Flex alignItems='baseline'>
            <Text bold fontSize='24px' color={QualityColor[plant_info?.rarity]}>
              {t(getPlanetRarity(plant_info?.rarity))}
            </Text>
            <Text ml='17px' fontSize='18px' bold>
              Lv{plant_info?.level}
            </Text>
          </Flex>
          <Text
            ml='20px'
            color={RaceTypeColor[plant_info?.race]}
            fontSize='18px'
            bold
          >
            {t(`race-${plant_info?.race}`)}
          </Text>
        </Flex>
        <Flex>
          <ScoringPanel
            scale='sm'
            ellipsis
            count={plant_info?.strengthenLevel}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};
