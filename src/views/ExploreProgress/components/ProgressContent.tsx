import React, { Fragment, useCallback, useMemo, useState } from 'react';
import {
  RefreshButton,
  Flex,
  Box,
  BackButton,
  MarkText,
  Text,
  Empty,
  Button,
  Progress,
} from 'uikit';
import styled from 'styled-components';
import { useTranslation } from 'contexts/Localization';
import { useStore } from 'state';
import { getTimePeriod, useCountdownTime } from 'components';

const PrFlex = styled(Flex)`
  & .SecurityRisk {
    background: linear-gradient(180deg, #e75551, #934654);
  }
  & .ExplorePro {
    background: transparent;
  }
`;

const ExploreProBgBox = styled(Box)`
  background: url('/images/commons/ExploreProBg.png') no-repeat;
  padding: 4px 2px;
  background-size: 100% 100%;
`;

const ProgressContent: React.FC<{ diffSeconds: number }> = ({
  diffSeconds,
}) => {
  const { t, getHTML } = useTranslation();
  const { end_time, free_time } = useStore(p => p.alliance.allianceView);
  const { hour, minute, second } = useMemo(() => {
    if (diffSeconds <= 0) {
      return {
        hour: 0,
        minute: 0,
        second: 0,
      };
    }
    const { hours, minutes, seconds } = getTimePeriod(diffSeconds);
    return {
      hour: hours,
      minute: minutes,
      second: seconds,
    };
  }, [diffSeconds]);

  return (
    <PrFlex alignItems='flex-end' flex={1} justifyContent='space-between'>
      <Box>
        <Text fontSize='20px' bold>
          {t('探索进度')}
        </Text>
        <Text small>
          {t('剩余')}&nbsp;
          {`( ${hour}${t('h')}:${minute}${t('m')}:${second}${t('s')} )`}
        </Text>
      </Box>
      <Box width='calc(100% - 150px)'>
        <Flex mb='10px'>
          <Text textAlign='center' width='37.5%' color='#15F33A'>
            {t('安全区(无被掠夺风险)')}
          </Text>
          <Text textAlign='center' width='62.5%' color='#E75551'>
            {t('风险区(会有遭遇战)')}
          </Text>
        </Flex>
        <Progress
          className='SecurityRisk'
          scale='sm'
          color='#15F33A'
          primaryStep={(1.5 / 4) * 100}
        />
        <ExploreProBgBox>
          <Progress
            variant='flat'
            className='ExplorePro'
            scale='lg'
            color='#1EB2FF'
            primaryStep={((end_time - diffSeconds) / end_time) * 100}
          />
        </ExploreProBgBox>
      </Box>
    </PrFlex>
  );
};

export default ProgressContent;
