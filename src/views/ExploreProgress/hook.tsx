/* eslint-disable */
import { useEffect, useRef, useState } from 'react';

export const useIncrease = (now = 0, increase = 0) => {
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const [diffSecond, setDiffSecond] = useState(0); // 秒

  useEffect(() => {
    const getIncrease = async () => {
      setDiffSecond(now);
      if (timer.current) {
        clearInterval(timer.current);
      }
      timer.current = setInterval(() => {
        setDiffSecond(p => p + increase);
      }, 1000);
    };
    if (increase > 0) {
      getIncrease();
    }
    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, [now, increase]);
  return diffSecond;
};
