import React from 'react';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';

import { formatDisplayApr } from 'utils/formatBalance';
import { Flex, Box, Text, MarkText } from 'uikit';
import { useTranslation } from 'contexts/Localization';
import { TokenImage } from 'components/TokenImage';

const Container = styled(Box)`
  width: 261px;
  height: 173px;
  background: url('/images/commons/dashboard/token-group.png');
  background-size: 100% 100%;
  padding: 8px 13px;
  padding-top: 16px;
  margin-left: -5px;
  position: relative;
`;

const Group = styled(Flex)`
  width: 100%;
  height: 42px;
  margin: 5px 0;
  padding: 0 26px 0 22px;
`;

export const PlanetAssets: React.FC<{
  plant_info: Api.Planet.PlanetInfo;
}> = ({ plant_info }) => {
  const { t } = useTranslation();
  return (
    <Container>
      <Group>
        <Flex width='100%' alignItems='center' flex={1}>
          <TokenImage width={30} height={32} tokenAddress='ORE' />
          <Text
            fontSize='15px'
            ml='5px'
            width='90px'
            ellipsis
            title={(plant_info?.stone || 0).toString()}
          >
            {plant_info?.stone}
          </Text>
          <Text
            fontSize='15px'
            ellipsis
            color='progressGreenBar'
            ml='5px'
            style={{ flex: 1 }}
            title={`${formatDisplayApr(
              new BigNumber(plant_info?.oreYield).toNumber(),
            )}/s`}
          >
            {formatDisplayApr(new BigNumber(plant_info?.oreYield).toNumber())}
            /s
          </Text>
        </Flex>
      </Group>
      <Group>
        <Flex width='100%' alignItems='center' flex={1}>
          <TokenImage width={30} height={32} tokenAddress='ENG' />
          <Text
            fontSize='15px'
            ml='5px'
            width='90px'
            ellipsis
            title={(plant_info?.energy || 0).toString()}
          >
            {plant_info?.energy}
          </Text>
          <Text
            fontSize='15px'
            ellipsis
            color='progressGreenBar'
            ml='5px'
            style={{ flex: 1 }}
            title={`${formatDisplayApr(
              new BigNumber(plant_info?.energyYield).toNumber(),
            )}/s`}
          >
            {formatDisplayApr(
              new BigNumber(plant_info?.energyYield).toNumber(),
            )}
            /s
          </Text>
        </Flex>
      </Group>
      <Group>
        <Flex width='100%' alignItems='center' flex={1}>
          <TokenImage width={30} height={32} tokenAddress='SPICES' />
          <Text
            fontSize='15px'
            ml='5px'
            width='90px'
            ellipsis
            title={(plant_info?.population || 0).toString()}
          >
            {plant_info?.population}
          </Text>
          <Text
            fontSize='15px'
            ellipsis
            color='progressGreenBar'
            ml='5px'
            style={{ flex: 1 }}
            title={`${formatDisplayApr(
              new BigNumber(plant_info?.populationYield).toNumber(),
            )}/s`}
          >
            {formatDisplayApr(
              new BigNumber(plant_info?.populationYield).toNumber(),
            )}
            /s
          </Text>
        </Flex>
      </Group>
      <Box
        position='absolute'
        left='0'
        right='0'
        top='4px'
        style={{ margin: 'auto', textAlign: 'center' }}
      >
        <MarkText fontSize='14px' fontStyle='normal' bold>
          {t('当前行星资源')}
        </MarkText>
      </Box>
    </Container>
  );
};
