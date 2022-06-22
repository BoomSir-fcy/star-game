import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Button, Flex, Text, Box } from 'uikit';
import { useTranslation } from 'contexts/Localization';
import { useStore } from 'state';
import { Api } from 'apis';
import { useToast } from 'contexts/ToastsContext';
import { useDispatch } from 'react-redux';
import { fetchAllianceViewAsync } from 'state/alliance/reducer';
import { useImmer } from 'use-immer';

import { EasyformatTime } from 'utils/timeFormat';

const Explore: React.FC<{
  Difficulty: number;
  ShowModule: boolean;
  setShowModule: (e) => void;
}> = ({ Difficulty, ShowModule, setShowModule }) => {
  const { t } = useTranslation();
  const { toastError, toastSuccess } = useToast();
  const dispatch = useDispatch();

  const {
    max_work_count,
    now_work_count,
    end_time,
    free_time,
    alliance,
    later_extract_time,
  } = useStore(p => p.alliance.allianceView);
  const { userInfo } = useStore(p => p.userInfo);

  const [state, setState] = useImmer({
    time: 0,
  });
  let timer = null as any;

  // 按钮文字显示
  const BtnShowText = useMemo(() => {
    // 工作中
    if (alliance.working !== 0) {
      return t('探索中');
    }
    // 次数用完
    if (max_work_count === now_work_count) {
      if (userInfo.vipBenefits?.is_vip) {
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

  // 倒计时
  const countDown = () => {
    if (alliance.working <= 0) {
      return;
    }
    timer = setInterval(() => {
      const { time } = state;
      if (time > 0) {
        setState(p => {
          p.time = time - 1;
        });
      } else {
        clearInterval(timer);
        if (free_time > 0) {
          dispatch(fetchAllianceViewAsync());
        }
      }
    }, 1000);
  };

  useEffect(() => {
    if (alliance.working <= 0) {
      setState({ time: end_time });
      return;
    }
    setState({ time: free_time });
  }, [free_time, alliance, end_time, later_extract_time, setState]);

  useEffect(() => {
    countDown();
    return () => {
      if (timer) clearInterval(timer);
    };
    // eslint-disable-next-line
  }, [state]);
  return (
    <Flex zIndex={1} position='relative' justifyContent='center'>
      <Button
        variant='vs'
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
            <Text> ( {EasyformatTime(state.time)} )</Text>
          )}
        </Flex>
      </Button>
    </Flex>
  );
};

export default Explore;
