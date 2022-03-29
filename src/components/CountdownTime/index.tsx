import React, { useEffect, useState } from 'react';
import { FlexProps } from 'uikit';
import { FlipTime } from './FlipTime';
import { useCountdownTime, getTimePeriod, getTimeDigital } from './hooks';
import { TimeFlex, Colon } from './style';

interface CountdownTimeProps extends FlexProps {
  endTime: number;
  startTime?: number;
}
interface TimeDigital {
  hour1?: string;
  hour2?: string;
  minute1?: string;
  minute2?: string;
  second1?: string;
  second2?: string;
}
export const CountdownTime: React.FC<CountdownTimeProps> = React.memo(
  ({ endTime, startTime, ...props }) => {
    const diffSeconds = useCountdownTime(endTime);
    const [state, setState] = useState({
      frontState: {} as TimeDigital,
      backState: {} as TimeDigital,
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

        setState({ frontState: frontDigital, backState: backDigital });
      }
    }, [diffSeconds]);

    return (
      <TimeFlex {...props}>
        <FlipTime
          mr='6px'
          front={state.frontState.hour1}
          back={state.backState.hour1}
        />
        <FlipTime front={state.frontState.hour2} back={state.backState.hour2} />
        <Colon>:</Colon>
        <FlipTime
          mr='6px'
          front={state.frontState.minute1}
          back={state.backState.minute1}
        />
        <FlipTime
          front={state.frontState.minute2}
          back={state.backState.minute2}
        />
        <Colon>:</Colon>
        <FlipTime
          mr='6px'
          front={state.frontState.second1}
          back={state.backState.second1}
        />
        <FlipTime
          front={state.frontState.second2}
          back={state.backState.second2}
        />
      </TimeFlex>
    );
  },
);
