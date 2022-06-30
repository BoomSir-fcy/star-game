import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from 'react';
import { Button, Flex, Text, Box } from 'uikit';
import { useTranslation } from 'contexts/Localization';
import { useStore } from 'state';
import { Api } from 'apis';
import { useToast } from 'contexts/ToastsContext';
import { useDispatch } from 'react-redux';
import { fetchAllianceViewAsync } from 'state/alliance/reducer';
import { useCountdownTime, getTimePeriod } from 'components';

const Explore: React.FC<{
  Difficulty: number;
  ShowModule: boolean;
  setShowModule: (e) => void;
}> = ({ Difficulty, ShowModule, setShowModule }) => {
  const { t } = useTranslation();
  const { toastError, toastSuccess } = useToast();
  const dispatch = useDispatch();

  const { max_work_count, now_work_count, end_time, free_time, alliance } =
    useStore(p => p.alliance.allianceView);
  const { userInfo } = useStore(p => p.userInfo);
  const timer = useRef<ReturnType<typeof setTimeout>>();

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

  // 按钮文字显示
  const BtnShowText = useMemo(() => {
    // 工作中
    if (alliance.working !== 0) {
      return t('探索中');
    }
    // 次数用完
    if (max_work_count === now_work_count) {
      if (!userInfo.vipBenefits?.is_vip) {
        return t('成为VIP可继续探索');
      }
    }
    return `${t('开始探索')}(${now_work_count}/${max_work_count})`;
  }, [alliance, t, now_work_count, max_work_count, userInfo]);

  // 开始工作
  const StartOrStopWorking = useCallback(async () => {
    await Api.AllianceApi.AllianceWorking({ difficulty: Difficulty })
      .then(res => {
        if (Api.isSuccess(res)) {
          toastSuccess(t('Operate Succeeded'));
          dispatch(fetchAllianceViewAsync());
        }
      })
      .catch(err => {
        toastError(t('Operate Failed'));
        console.error(err);
      });
  }, [toastSuccess, toastError, t, dispatch, Difficulty]);

  useEffect(() => {
    // 已经停止工作 清除倒计时
    if (alliance.working === 0 || diffSeconds > 0) {
      if (timer.current) {
        clearInterval(timer.current);
      }
      return;
    }
    // 倒计时为0并且在工作状态
    console.log(diffSeconds, alliance.working);
    if (diffSeconds === 0 && alliance.working === 1) {
      console.log('---1--');

      if (timer) {
        console.log('---2--');

        clearInterval(timer.current);
      }
      timer.current = setInterval(() => {
        console.log('--3---');
        dispatch(fetchAllianceViewAsync());
      }, 5000);
    }
  }, [diffSeconds, alliance.working, dispatch]);

  return (
    <Flex zIndex={1} position='relative' justifyContent='center'>
      <Button
        variant='purple'
        width='300px'
        disabled={alliance.working !== 0 || max_work_count === now_work_count}
        onClick={() => {
          if (ShowModule) {
            StartOrStopWorking();
          }
          setShowModule(true);
        }}
      >
        <Flex flexDirection='column'>
          <Text fontSize='22px'>{BtnShowText}</Text>
          {alliance.working !== 0 && (
            <Text>
              {`( ${hour}${t('h')}:${minute}${t('m')}:${second}${t('s')} )`}
            </Text>
          )}
        </Flex>
      </Button>
    </Flex>
  );
};

export default Explore;
