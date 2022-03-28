import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import styled from 'styled-components';
import { Text, Flex, Box } from 'uikit';
import { useCountdownTime, getTimePeriod } from './hooks';

const TimeFlex = styled(Flex)`
  position: relative;
  align-items: center;
`;
const Colon = styled(Text)`
  margin: 0 15px;
  font-size: 25px;
`;
const Time = styled(Box)`
  width: 54px;
  height: 71px;
  line-height: 71px;
  background: url('/images/commons/btn/download-time.png') no-repeat;
  background-size: 327px 159px;
  /* transition: background-position-y 0.3s; */
  &.time-1 {
    background-position: -10px -4px;
  }
  &.time-2 {
    background-position: -73px -4px;
  }
  &.time-3 {
    background-position: -137px -4px;
  }
  &.time-4 {
    background-position: -201px -4px;
  }
  &.time-5 {
    background-position: -265px -4px;
  }
  &.time-6 {
    background-position: -10px -81px;
  }
  &.time-7 {
    background-position: -74px -81px;
  }
  &.time-8 {
    background-position: -138px -80px;
  }
  &.time-9 {
    background-position: -202px -80px;
  }
  &.time-0 {
    background-position: -265px -80px;
  }
`;

interface CountdownTimeProps {
  endTime: number;
  startTime?: number;
}
export const CountdownTime: React.FC<CountdownTimeProps> = ({
  endTime,
  startTime,
}) => {
  const diffSeconds = useCountdownTime(endTime);
  console.log(diffSeconds);

  const [state, setState] = useState({
    hour1: '0',
    hour2: '0',
    minute1: '0',
    minute2: '0',
    second1: '0',
    second2: '0',
  });

  useEffect(() => {
    const { hours, minutes, seconds } = getTimePeriod(diffSeconds);
    let hour1 = '';
    let hour2 = '';
    let minute1 = '';
    let minute2 = '';
    let second1 = '';
    let second2 = '';
    if (hours < 10) {
      hour1 = '0';
      hour2 = hours.toString();
    } else {
      const h = hours.toString();
      hour1 = h.substring(0, 1);
      hour2 = h.substring(1);
    }
    if (minutes < 10) {
      minute1 = '0';
      minute2 = minutes.toString();
    } else {
      const m = minutes.toString();
      minute1 = m.substring(0, 1);
      minute2 = m.substring(1);
    }
    if (seconds < 10) {
      second1 = '0';
      second2 = seconds.toString();
    } else {
      const s = seconds.toString();
      second1 = s.substring(0, 1);
      second2 = s.substring(1);
    }
    setState({
      hour1,
      hour2,
      minute1,
      minute2,
      second1,
      second2,
    });
  }, [diffSeconds]);

  return (
    <TimeFlex>
      <Time className={`time-${state.hour1}`} mr='6px' />
      <Time className={`time-${state.hour2}`} />
      <Colon bold>:</Colon>
      <Time className={`time-${state.minute1}`} mr='6px' />
      <Time className={`time-${state.minute2}`} />
      <Colon bold>:</Colon>
      <Time className={`time-${state.second1}`} mr='6px' />
      <Time className={`time-${state.second2}`} />
    </TimeFlex>
  );
};
