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

export const getTimeDigital = (
  hours: number,
  minutes: number,
  seconds: number,
) => {
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
  return { hour1, hour2, minute1, minute2, second1, second2 };
};
