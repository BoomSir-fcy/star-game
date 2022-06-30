import React from 'react';
import BigNumber from 'bignumber.js';
import { Flex, Progress, Text } from 'uikit';

import { formatDisplayApr } from 'utils/formatBalance';
import { TokenImage } from 'components/TokenImage';
import { useTranslation } from 'contexts/Localization';

export const BuildingProgress: React.FC<{
  token: string;
  title: string;
  value: number;
  nextValue: number;
  progressbar?: number;
}> = ({ token, title, value, nextValue, progressbar }) => {
  const { t } = useTranslation();

  return (
    <Flex flex={1}>
      <TokenImage width={50} height={50} tokenAddress={token} />
      <Flex ml='9px' flexDirection='column' flex={1}>
        <Flex width='100%' mb='7px'>
          <Flex justifyContent='space-between' alignItems='center' width='100%'>
            <Flex alignItems='center'>
              <Text color='textSubtle'>{title}</Text>
              <Text ml='12px'>
                {formatDisplayApr(new BigNumber(value).toNumber())}
              </Text>
            </Flex>
            <Text
              color={`${nextValue >= 0 ? 'progressGreenBar' : 'textDanger'}`}
            >
              {t('Next Lv. ', {
                value: nextValue
                  ? nextValue > 0
                    ? `+${formatDisplayApr(
                        new BigNumber(nextValue).toNumber(),
                      )}`
                    : `${formatDisplayApr(new BigNumber(nextValue).toNumber())}`
                  : 0,
              })}
            </Text>
          </Flex>
        </Flex>
        <Progress
          color='progressGreenBar'
          variant='round'
          scale='sm'
          linear
          primaryStep={progressbar}
        />
      </Flex>
    </Flex>
  );
};
