import { getTimePeriod, useCountdownTime } from 'components';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Card, Text, Flex, Button, CardProps } from 'uikit';
import { Api } from 'apis';
import utc from 'dayjs/plugin/utc';
import { useToast } from 'contexts/ToastsContext';

dayjs.extend(utc);

const StyledCard = styled(Card)`
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.colors.backgroundDisabled};
`;

interface RewardsProps extends CardProps {
  t: any;
  galaxy_id: number;
}
export const Rewards: React.FC<RewardsProps> = ({ t, galaxy_id, ...props }) => {
  const { toastError, toastSuccess } = useToast();
  // 当天零点（utc时间）
  const endTimestamp = dayjs().utc(true).endOf('day').unix();
  const startTimestamp = dayjs().utc(true).unix();
  const diffSeconds = useCountdownTime(0, 0, endTimestamp - startTimestamp);

  const [claimMax, setClaimMax] = useState(0);

  const { hour, minute, second } = useMemo(() => {
    const { hours, minutes, seconds } = getTimePeriod(diffSeconds);
    return {
      hour: hours,
      minute: minutes,
      second: seconds,
    };
  }, [diffSeconds]);

  const getClaimMax = useCallback(async () => {
    try {
      const res = await Api.GalaxyApi.getClaimMax(galaxy_id);
      if (Api.isSuccess(res)) {
        setClaimMax(res.data?.amount);
      }
    } catch (error) {
      console.log(error);
    }
  }, [galaxy_id]);

  const handleClaim = useCallback(async () => {
    try {
      const res = await Api.GalaxyApi.ClaimRewards(galaxy_id);
      if (Api.isSuccess(res)) {
        toastSuccess(t('Claim succeeded'));
        getClaimMax();
      }
    } catch (error) {
      console.log(error);
      toastError(t('Claim failed'));
    }
  }, [galaxy_id, toastSuccess, toastError, t, getClaimMax]);

  useEffect(() => {
    if (galaxy_id) getClaimMax();
  }, [getClaimMax, galaxy_id]);
  return (
    <StyledCard {...props}>
      <Flex justifyContent='space-between' alignItems='center'>
        <Flex flexDirection='column'>
          <Text color='textTips' small>
            {t('Available today(STAR)')}
          </Text>
          <Text mt='10px' fontSize='28px' shadow='primary'>
            {claimMax}
          </Text>
        </Flex>
        <Flex flexDirection='column'>
          <Text color='textTips' small>
            {t('Remaining available time (UTC 24)')}
          </Text>
          <Text mt='10px' fontSize='28px'>
            {`${hour}${t('h')}:${minute}${t('m')}:${second}${t('s')}`}
          </Text>
        </Flex>
        <Button
          disabled={!claimMax || diffSeconds <= 0}
          padding='10px 20px'
          onClick={handleClaim}
        >
          {t('Claim')}
        </Button>
      </Flex>
    </StyledCard>
  );
};