import React from 'react';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import { Flex, Box, Text, Image, Button } from 'uikit';
import { useTranslation } from 'contexts/Localization';

import { formatDisplayApr } from 'utils/formatBalance';
import { BarRightWarp } from './barRightWarp';

const Warp = styled(Flex)`
  padding: 20px 25px;
`;

const Items = styled(Box)`
  width: 50%;
  height: 30px;
`;

export const PlanetBuff: React.FC<{
  current_buff?: Api.Building.BuildingBuffer;
}> = ({ current_buff }) => {
  const { t } = useTranslation();
  return (
    <BarRightWarp title={t('buff bonus')}>
      <Warp flexWrap='wrap'>
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
            {formatDisplayApr(new BigNumber(current_buff?.speed).toNumber(), 0)}
          </Text>
        </Items>
        <Items>
          <Text>
            {t('dodge')}: +
            {formatDisplayApr(new BigNumber(current_buff?.miss).toNumber(), 0)}
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
    </BarRightWarp>
  );
};
