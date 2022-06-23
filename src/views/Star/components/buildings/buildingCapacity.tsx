import React from 'react';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import { Flex, Box, MarkText, Text } from 'uikit';

import { useTranslation } from 'contexts/Localization';
import { TokenImage } from 'components/TokenImage';
import { BuildingDetailType } from 'state/types';
import { formatDisplayApr } from 'utils/formatBalance';

const GroupItems = styled(Flex)`
  width: 50%;
  align-items: center;
`;

export const BuildingCapacity: React.FC<{
  currnet_building: Api.Building.BuildingDetail;
}> = ({ currnet_building }) => {
  const { t } = useTranslation();

  console.log(currnet_building);

  return (
    <Box>
      <MarkText bold fontSize='18px' fontStyle='normal' mb='25px'>
        产能详情
      </MarkText>
      <Flex width='100%' flexDirection='column'>
        <Flex width='100%' justifyContent='space-between'>
          {BuildingDetailType.BuildingDetailTypeStone ===
            currnet_building?.detail_type && (
            <GroupItems>
              <TokenImage width={55} height={55} tokenAddress='ORE' />
              <Flex ml='20px' flexDirection='column'>
                <Text color='textSubtle'>{t('Ore Capacity')}</Text>
                <Text color='progressGreenBar'>{`${formatDisplayApr(
                  new BigNumber(
                    currnet_building?.stone?.product?.per_sec_ouput_stone,
                  ).toNumber(),
                )}/s`}</Text>
              </Flex>
            </GroupItems>
          )}
          {BuildingDetailType.BuildingDetailTypePopulation ===
            currnet_building?.detail_type && (
            <GroupItems>
              <TokenImage width={55} height={55} tokenAddress='SPICES' />
              <Flex ml='20px' flexDirection='column'>
                <Text color='textSubtle'>{t('Population Capacity')}</Text>
                <Text color='progressGreenBar'>{`${currnet_building?.population?.product?.per_sec_ouput_population}/s`}</Text>
              </Flex>
            </GroupItems>
          )}
          {BuildingDetailType.BuildingDetailTypeEnergy ===
            currnet_building?.detail_type && (
            <GroupItems>
              <TokenImage width={55} height={55} tokenAddress='ENG' />
              <Flex ml='20px' flexDirection='column'>
                <Text color='textSubtle'>{t('Energy Capacity')}</Text>
                <Text color='progressGreenBar'>{`${currnet_building?.energy?.product?.per_sec_ouput_energy}/s`}</Text>
              </Flex>
            </GroupItems>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};
