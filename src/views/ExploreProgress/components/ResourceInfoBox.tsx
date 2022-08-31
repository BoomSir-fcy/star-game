import React, { Fragment, useCallback, useMemo, useState } from 'react';
import { Flex, Box, Image, Text, Progress } from 'uikit';
import styled from 'styled-components';
import { useTranslation } from 'contexts/Localization';
import { formatLocalisedCompactBalance } from 'utils/formatBalance';
import { useIncrease } from '../hook';

interface reItemView {
  img: string;
  Protect: number;
  now: number;
  max: number;
  sec: number;
}

const ResourceProgressFlex = styled(Flex)`
  & .ResourcePro {
    background: #241f17;
    & .secondaryStep {
      z-index: 0;
      background: #161920;
      background-size: 10px 10px;
      background-image: linear-gradient(
        45deg,
        #15f33a75 25%,
        #15f33a61 25%,
        #15f33a61 50%,
        #15f33a75 50%,
        #15f33a75 75%,
        #15f33a61 75%,
        #15f33a61
      );
    }
  }
`;

const ResourceInfoBox: React.FC<{
  reItem: reItemView;
  WorkEnd: boolean;
}> = ({ reItem, WorkEnd }) => {
  const { t, getHTML } = useTranslation();

  const format = useCallback((number: number) => {
    return formatLocalisedCompactBalance(number, 2) || 0;
  }, []);

  const NowResource = useIncrease(reItem.now, WorkEnd ? 0 : reItem.sec);

  const CalculatedNowResource = useMemo(() => {
    return NowResource > 0 ? NowResource : reItem.now;
  }, [NowResource, reItem]);

  return (
    <ResourceProgressFlex>
      <Box width={40} height={40} mr='5px'>
        <Image
          src={`/images/commons/icon/${reItem?.img}.png`}
          width={40}
          height={40}
        />
      </Box>
      <Flex flexDirection='column' flex={1}>
        <Flex mb='4px' justifyContent='space-between' alignItems='center'>
          <Flex>
            <Text small mr='4px'>
              {t('保护值')}
            </Text>
            <Text small color='#1EB2FF'>
              {format(reItem?.Protect)}
            </Text>
          </Flex>
          <Flex>
            <Text small color='#15F33A'>
              {format(
                CalculatedNowResource > reItem?.max
                  ? reItem?.max
                  : CalculatedNowResource,
              )}
            </Text>
            <Text small>/{format(reItem?.max)}</Text>
          </Flex>
        </Flex>
        <Progress
          className='ResourcePro'
          scale='sm'
          color='#1EB2FF'
          primaryStep={(reItem?.Protect / reItem?.max) * 100}
          secondaryStep={(CalculatedNowResource / reItem?.max) * 100}
        />
      </Flex>
    </ResourceProgressFlex>
  );
};

export default ResourceInfoBox;
