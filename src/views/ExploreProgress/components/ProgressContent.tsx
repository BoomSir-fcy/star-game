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

const ProgressContent: React.FC = () => {
  const { t, getHTML } = useTranslation();
  const { max_work_count, now_work_count, end_time, free_time, alliance } =
    useStore(p => p.alliance.allianceView);

  const diffSeconds = useCountdownTime(0, 0, free_time);
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
    <Flex>
      <Box>
        <Text fontSize='20px' bold>
          {t('探索进度')}
        </Text>
        <Text small>
          {t('剩余')}&nbsp;
          {`( ${hour}${t('h')}:${minute}${t('m')}:${second}${t('s')} )`}
        </Text>
      </Box>
      <Box>
        <Progress color='#1EB2FF' primaryStep={1} />
      </Box>
    </Flex>
  );
};

export default ProgressContent;
