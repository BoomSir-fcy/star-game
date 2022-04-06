import React, { useEffect, useState } from 'react';
import { FlexProps } from 'uikit';
import { FlipTime } from './FlipTime';
import { useCountdownTime, getTimePeriod, getTimeDigital } from './hooks';
import { TimeFlex, Colon } from './style';

interface CountdownTimeProps extends FlexProps {
  endTime?: number;
  startTime?: number;
  timePeriod?: number;
}
interface TimeDigital {
  hour1: string;
  hour2: string;
  minute1: string;
  minute2: string;
  second1: string;
  second2: string;
}
export const CountdownTime: React.FC<CountdownTimeProps> = React.memo(
  ({ endTime = 0, startTime = 0, timePeriod = 0, ...props }) => {
    const diffSeconds = useCountdownTime(endTime, startTime, timePeriod);
    const [state, setState] = useState({
      hour1: { front: '0', back: '0' },
      hour2: { front: '0', back: '0' },
      minute1: { front: '0', back: '0' },
      minute2: { front: '0', back: '0' },
      second1: { front: '0', back: '0' },
      second2: { front: '0', back: '0' },
    });

    useEffect(() => {
      if (diffSeconds > 0) {
        // 前一张牌的时间
        const frontTime = getTimePeriod(diffSeconds);
        const frontDigital = getTimeDigital(
          frontTime.hours,
          frontTime.minutes,
          frontTime.seconds,
        );

        // 后一张牌的时间
        const backTime = getTimePeriod(diffSeconds - 1);
        const backDigital = getTimeDigital(
          backTime.hours,
          backTime.minutes,
          backTime.seconds,
        );

        setState({
          hour1: { front: frontDigital.hour1, back: backDigital.hour1 },
          hour2: { front: frontDigital.hour2, back: backDigital.hour2 },
          minute1: { front: frontDigital.minute1, back: backDigital.minute1 },
          minute2: { front: frontDigital.minute2, back: backDigital.minute2 },
          second1: { front: frontDigital.second1, back: backDigital.second1 },
          second2: { front: frontDigital.second2, back: backDigital.second2 },
        });
      }
    }, [diffSeconds]);

    return (
      <TimeFlex {...props}>
        <FlipTime mr='6px' front={state.hour1.front} back={state.hour1.back} />
        <FlipTime front={state.hour2.front} back={state.hour2.back} />
        <Colon>:</Colon>
        <FlipTime
          mr='6px'
          front={state.minute1.front}
          back={state.minute1.back}
        />
        <FlipTime front={state.minute2.front} back={state.minute2.back} />
        <Colon>:</Colon>
        <FlipTime
          mr='6px'
          front={state.second1.front}
          back={state.second1.back}
        />
        <FlipTime front={state.second2.front} back={state.second2.back} />
      </TimeFlex>
    );
  },
);
