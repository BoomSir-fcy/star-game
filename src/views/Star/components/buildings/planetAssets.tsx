import React from 'react';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';

import { formatDisplayApr } from 'utils/formatBalance';
import { Flex, Box, Text, MarkText } from 'uikit';
import { useTranslation } from 'contexts/Localization';
import { TokenImage } from 'components/TokenImage';
import { BarRightWarp } from './barRightWarp';

const Group = styled(Flex)`
  width: 100%;
  height: 42px;
  margin-bottom: 20px;
`;

const AssetsContent = styled(Flex)`
  width: 250px;
  flex-direction: column;
  border-right: 1px solid #3a5050;
`;

const Warp = styled(Flex)`
  flex: 1;
  justify-content: center;
`;

const Items = styled(Box)`
  width: 100%;
  height: 28px;
  text-align: center;
`;

export const PlanetAssets: React.FC<{
  plant_info: Api.Planet.PlanetInfo;
  current_buff?: Api.Building.BuildingBuffer;
}> = ({ plant_info, current_buff }) => {
  const { t } = useTranslation();

  return (
    <BarRightWarp>
      <Flex width='100%' alignItems='flex-start'>
        <AssetsContent>
          <MarkText
            fontSize='14px'
            mb='20px'
            fontStyle='normal'
            bold
            textAlign='center'
          >
            {t('Current Planetary Resources')}
          </MarkText>
          <Group>
            <Flex width='100%' alignItems='center' flex={1}>
              <TokenImage width={40} height={50} tokenAddress='ORE' />
              <Flex flexDirection='column' ml='18px'>
                <Text
                  small
                  mb='3px'
                  width='90px'
                  ellipsis
                  title={(plant_info?.stone || 0).toString()}
                >
                  {formatDisplayApr(
                    new BigNumber(plant_info?.stone).toNumber(),
                  )}
                </Text>
                <Text
                  small
                  ellipsis
                  color='progressGreenBar'
                  style={{ flex: 1 }}
                  title={`${formatDisplayApr(
                    new BigNumber(plant_info?.oreYield).toNumber(),
                  )}/s`}
                >
                  {formatDisplayApr(
                    new BigNumber(plant_info?.oreYield).toNumber(),
                  )}
                  /s
                </Text>
              </Flex>
            </Flex>
          </Group>
          <Group>
            <Flex width='100%' alignItems='center' flex={1}>
              <TokenImage width={40} height={40} tokenAddress='ENG' />
              <Flex flexDirection='column' ml='18px'>
                <Text
                  small
                  mb='3px'
                  width='90px'
                  ellipsis
                  title={(plant_info?.energy || 0).toString()}
                >
                  {formatDisplayApr(
                    new BigNumber(plant_info?.energy).toNumber(),
                  )}
                </Text>
                <Text
                  small
                  ellipsis
                  color='progressGreenBar'
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
            </Flex>
          </Group>
          <Group>
            <Flex width='100%' alignItems='center' flex={1}>
              <TokenImage width={40} height={40} tokenAddress='SPICES' />
              <Flex flexDirection='column' ml='18px'>
                <Text
                  small
                  mb='3px'
                  width='90px'
                  ellipsis
                  title={(plant_info?.population || 0).toString()}
                >
                  {formatDisplayApr(
                    new BigNumber(plant_info?.population).toNumber(),
                  )}
                </Text>
                <Text
                  small
                  ellipsis
                  color='progressGreenBar'
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
            </Flex>
          </Group>
        </AssetsContent>
        <Warp
          flexDirection='column'
          style={{
            borderRight: '1px solid #3a5050',
          }}
        >
          <MarkText
            fontSize='14px'
            mb='20px'
            fontStyle='normal'
            bold
            textAlign='center'
          >
            {t('buff bonus')}
          </MarkText>
          <Items>
            <Text>
              HP: +
              {formatDisplayApr(new BigNumber(current_buff?.hp).toNumber(), 0)}
            </Text>
          </Items>
          <Items>
            <Text>
              {t('Attack')}: +
              {formatDisplayApr(
                new BigNumber(current_buff?.attack).toNumber(),
                0,
              )}
            </Text>
          </Items>
          <Items>
            <Text>
              {t('hit')}: +
              {formatDisplayApr(new BigNumber(current_buff?.hit).toNumber(), 0)}
            </Text>
          </Items>
          <Items>
            <Text>
              {t('firstMove')}: +
              {formatDisplayApr(
                new BigNumber(current_buff?.speed).toNumber(),
                0,
              )}
            </Text>
          </Items>
          <Items>
            <Text>
              {t('dodge')}: +
              {formatDisplayApr(
                new BigNumber(current_buff?.miss).toNumber(),
                0,
              )}
            </Text>
          </Items>
          <Items>
            <Text>
              {t('Burst')}: +
              {formatDisplayApr(
                new BigNumber(current_buff?.critical).toNumber(),
                0,
              )}
            </Text>
          </Items>
          <Items>
            <Text>
              {t('Defense')}: +
              {formatDisplayApr(
                new BigNumber(current_buff?.defense).toNumber(),
                0,
              )}
            </Text>
          </Items>
        </Warp>
        <Warp flexDirection='column'>
          <MarkText
            fontSize='14px'
            mb='20px'
            fontStyle='normal'
            bold
            textAlign='center'
          >
            {t('Nurturing bonus')}
          </MarkText>
          <Items>
            <Text>
              HP: +
              {formatDisplayApr(
                new BigNumber(plant_info?.strengthen?.hp).toNumber(),
                0,
              )}
            </Text>
          </Items>
          <Items>
            <Text>
              {t('Attack')}: +
              {formatDisplayApr(
                new BigNumber(plant_info?.strengthen?.attack).toNumber(),
                0,
              )}
            </Text>
          </Items>
          <Items>
            <Text>
              {t('hit')}: +
              {formatDisplayApr(
                new BigNumber(plant_info?.strengthen?.hit).toNumber(),
                0,
              )}
            </Text>
          </Items>
          <Items>
            <Text>
              {t('firstMove')}: +
              {formatDisplayApr(
                new BigNumber(plant_info?.strengthen?.speed).toNumber(),
                0,
              )}
            </Text>
          </Items>
          <Items>
            <Text>
              {t('dodge')}: +
              {formatDisplayApr(
                new BigNumber(plant_info?.strengthen?.miss).toNumber(),
                0,
              )}
            </Text>
          </Items>
          <Items>
            <Text>
              {t('Burst')}: +
              {formatDisplayApr(
                new BigNumber(plant_info?.strengthen?.critical).toNumber(),
                0,
              )}
            </Text>
          </Items>
          <Items>
            <Text>
              {t('Defense')}: +
              {formatDisplayApr(
                new BigNumber(plant_info?.strengthen?.defense).toNumber(),
                0,
              )}
            </Text>
          </Items>
        </Warp>
      </Flex>
    </BarRightWarp>
  );
};
