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
import { useCountdownTime, getTimePeriod, TooltipTrigger } from 'components';
import { useNavigate } from 'react-router-dom';

const Explore: React.FC<{
  Difficulty: number;
  ShowModule: boolean;
  setShowModule: (e) => void;
}> = ({ Difficulty, ShowModule, setShowModule }) => {
  const { t } = useTranslation();
  const { toastError, toastSuccess } = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    max_work_count,
    now_work_count,
    end_time,
    free_time,
    alliance,
    hold_planet,
  } = useStore(p => p.alliance.allianceView);
  const { userInfo } = useStore(p => p.userInfo);
  const { scale, TooltipTriggerZIndex } = useStore(p => p.user);

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
    if (hold_planet) {
      return t('Occupying Stars');
    }
    // 工作中
    if (alliance.working !== 0) {
      return t('View Explore Progress');
    }
    // 次数用完
    if (max_work_count === now_work_count) {
      if (!userInfo.vipBenefits?.is_vip) {
        return t('Become a VIP to continue exploring');
      }
    }
    return `${t('Start Exploration')}(${now_work_count}/${max_work_count})`;
  }, [alliance, t, now_work_count, max_work_count, userInfo, hold_planet]);

  // // 开始工作
  // const StartOrStopWorking = useCallback(async () => {
  //   await Api.AllianceApi.AllianceWorking({ difficulty: Difficulty })
  //     .then(res => {
  //       if (Api.isSuccess(res)) {
  //         toastSuccess(t('Operate Succeeded'));
  //         dispatch(fetchAllianceViewAsync());
  //       }
  //     })
  //     .catch(err => {
  //       toastError(t('Operate Failed'));
  //       console.error(err);
  //     });
  // }, [toastSuccess, toastError, t, dispatch, Difficulty]);

  useEffect(() => {
    // 已经停止工作 清除倒计时
    // if (alliance.working === 0 || diffSeconds > 0) {
    //   if (timer.current) {
    //     clearInterval(timer.current);
    //   }
    //   return;
    // }
    // 停止工作
    const StopWorking = async () => {
      await Api.AllianceApi.AllianceStopWork()
        .then(res => {
          if (Api.isSuccess(res)) {
            setTimeout(() => {
              dispatch(fetchAllianceViewAsync());
            }, 2000);
          }
        })
        .catch(err => {
          console.error(err);
        });
    };
    // 倒计时为0并且在工作状态
    if (diffSeconds <= 0 && alliance.working === 1) {
      StopWorking();
      // if (timer) {
      //   clearInterval(timer.current);
      // }
      // timer.current = setInterval(() => {
      //   StopWorking();
      // }, 3000);
    }
  }, [diffSeconds, alliance.working, dispatch]);

  return (
    <Flex zIndex={1} position='relative' justifyContent='center'>
      <TooltipTrigger
        zIndex={TooltipTriggerZIndex}
        overlay={
          <Text fontSize={`${16 * scale}px`} color='textTips'>
            {t('Earn Resources')}
          </Text>
        }
        defaultVisible
        trigger={[]}
        placement='topRight'
      >
        <Button
          className='Start_Exploration'
          variant='purple'
          width='300px'
          // disabled={alliance.working !== 0 || max_work_count === now_work_count}
          disabled={max_work_count === now_work_count}
          onClick={() => {
            if (alliance.working !== 0) {
              navigate('/explore-progress');
            } else if (hold_planet) {
              toastError(t('http-error-300031'));
            } else {
              setShowModule(true);
            }
          }}
        >
          <Flex flexDirection='column'>
            <Text color='textPrimary' fontSize='22px'>
              {BtnShowText}
            </Text>
            {alliance.working !== 0 && (
              <Text>
                {diffSeconds <= 0
                  ? t('Coming to an end...')
                  : `( ${hour}${t('h')}:${minute}${t('m')}:${second}${t(
                      's',
                    )} )`}
              </Text>
            )}
          </Flex>
        </Button>
      </TooltipTrigger>
    </Flex>
  );
};

export default Explore;
