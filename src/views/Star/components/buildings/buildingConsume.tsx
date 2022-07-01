import React from 'react';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import { Flex, Box, Text, MarkText } from 'uikit';
import { useTranslation } from 'contexts/Localization';
import { TokenImage } from 'components/TokenImage';

import { formatDisplayApr } from 'utils/formatBalance';

const GroupItems = styled(Flex)`
  width: calc(100% / 3);
`;

export const BuildingConsume: React.FC<{
  currnet_building: Api.Building.Building;
}> = ({ currnet_building }) => {
  const { t } = useTranslation();
  return (
    <Box mb='20px'>
      <MarkText bold fontSize='18px' fontStyle='normal' mb='15px'>
        {t('resource consumption')}
      </MarkText>
      <Flex width='100%'>
        <GroupItems>
          <TokenImage width={50} height={50} tokenAddress='ORE' />
          <Flex ml='8px' flexDirection='column'>
            <Text color='textSubtle' mb='5px'>
              {t('Ore')}
            </Text>
            <Text small>{`${formatDisplayApr(
              new BigNumber(
                currnet_building?.propterty?.per_cost_stone,
              ).toNumber(),
            )}/s`}</Text>
          </Flex>
        </GroupItems>
        <GroupItems>
          <TokenImage width={50} height={50} tokenAddress='ENG' />
          <Flex ml='8px' flexDirection='column'>
            <Text color='textSubtle' mb='5px'>
              {t('Energy')}
            </Text>
            <Text small>{`${formatDisplayApr(
              new BigNumber(
                currnet_building?.propterty?.per_cost_energy,
              ).toNumber(),
            )}/s`}</Text>
          </Flex>
        </GroupItems>
        <GroupItems>
          <TokenImage width={50} height={50} tokenAddress='SPICES' />
          <Flex ml='8px' flexDirection='column'>
            <Text color='textSubtle' mb='5px'>
              {t('Population')}
            </Text>
            <Text small>{`${formatDisplayApr(
              new BigNumber(
                currnet_building?.propterty?.per_cost_population,
              ).toNumber(),
            )}/s`}</Text>
          </Flex>
        </GroupItems>
      </Flex>
    </Box>
  );
};
