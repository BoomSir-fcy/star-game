import { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';

export const useCountdownTime = (endTime: number, startTime?: number) => {
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const [diffSecond, setDiffSecond] = useState(0); // 秒
  useEffect(() => {
    const startCountdown = async () => {
      let nowTime = dayjs().unix();
      if (startTime) {
        nowTime = startTime;
      }
      setDiffSecond(endTime - nowTime);

      if (endTime > nowTime) {
        if (timer.current) {
          clearInterval(timer.current);
        }
        timer.current = setInterval(() => {
          const diff = endTime - dayjs().unix();
          setDiffSecond(diff);
        }, 1000);
      }
    };
    startCountdown();

    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, [setDiffSecond, endTime, startTime]);

  return diffSecond;
};

const MINUTE_IN_SECONDS = 60;
const HOUR_IN_SECONDS = 60 * 60;
const DAY_IN_SECONDS = 60 * 60 * 24;
const MONTH_IN_SECONDS = 60 * 60 * 24 * 30;
const YEAR_IN_SECONDS = 60 * 60 * 24 * 30 * 12;

export const getTimePeriod = (diffSeconds: number) => {
  let delta = Math.abs(diffSeconds);
  const timeLeft = {
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  };

  if (delta >= YEAR_IN_SECONDS) {
    timeLeft.years = Math.floor(delta / YEAR_IN_SECONDS);
    delta -= timeLeft.years * YEAR_IN_SECONDS;
  }

  if (delta >= MONTH_IN_SECONDS) {
    timeLeft.months = Math.floor(delta / MONTH_IN_SECONDS);
    delta -= timeLeft.months * MONTH_IN_SECONDS;
  }

  if (delta >= DAY_IN_SECONDS) {
    timeLeft.days = Math.floor(delta / DAY_IN_SECONDS);
    delta -= timeLeft.days * DAY_IN_SECONDS;
  }

  if (delta >= HOUR_IN_SECONDS) {
    timeLeft.hours = Math.floor(delta / HOUR_IN_SECONDS);
    delta -= timeLeft.hours * HOUR_IN_SECONDS;
  }

  if (delta >= MINUTE_IN_SECONDS) {
    timeLeft.minutes = Math.floor(delta / MINUTE_IN_SECONDS);
    delta -= timeLeft.minutes * MINUTE_IN_SECONDS;
  }

  timeLeft.seconds = delta;

  return timeLeft;
};
