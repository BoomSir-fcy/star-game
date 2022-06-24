import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { BgCard, Box, Flex, Spinner, Text } from 'uikit';
import { useStore, storeAction } from 'state';
import {
  useFetchAllianceView,
  useFetchCombatRecord,
} from 'state/alliance/hooks';

import { fetchAllianceViewAsync } from 'state/alliance/reducer';
import eventBus from 'utils/eventBus';
import { Steps, Hints } from 'intro.js-react'; // 引入我们需要的组件
import { useGuide } from 'hooks/useGuide';
import { useTranslation } from 'contexts/Localization';
import { PkBox } from './pkBox';
import { BattleTop } from './BattleTop';
import { InProgress } from './components/inProgress';

const ScrollBox = styled(Box)`
  /* min-height: 400px;
  max-height: 650px; */
  height: 650px;
  margin-top: 22px;
  overflow-y: auto;
  overflow-x: hidden;
  padding-left: 30px;
  &::-webkit-scrollbar {
    height: 0;
  }
`;

const ItemBox = styled(Box)`
  display: block;
  height: auto;
  margin-bottom: 20px;
`;

const RowFlex = styled(Flex)`
  overflow-x: auto;
  height: 364px;
  background: linear-gradient(270deg, #162d37, #0b1c22, #0a161b);
  border: 2px solid #4ffffb;
  margin-bottom: 30px;
  &::-webkit-scrollbar {
    height: 0;
  }
`;

const LoadingBox = styled(Box)`
  position: absolute;
  left: 56%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const BattleReport = () => {
  useFetchAllianceView();
  const dispatch = useDispatch();
  const location = useLocation();
  const { t } = useTranslation();

  const { pkRecord } = useStore(p => p.alliance);
  const {
    record: RecordList,
    failed_count: FailedCont,
    win_count: WinCont,
    count: Cont,
    isEnd: end,
    loading,
  } = pkRecord;

  const { guides, setGuide } = useGuide(location.pathname);
  const [stepsEnabled, setStepsEnabled] = useState(true);
  const [Start_time, setStart_time] = useState<number>(
    new Date(new Date().toLocaleDateString()).getTime() / 1000,
  );
  const [End_time, setEnd_time] = useState<number>(
    new Date(new Date().toLocaleDateString()).getTime() / 1000,
  );

  useFetchCombatRecord(Start_time, End_time);

  // const loadMore = useCallback(
  //   (e: any) => {
  //     const { offsetHeight, scrollTop, scrollHeight } = e.nativeEvent.target;
  //     if (offsetHeight + scrollTop === scrollHeight) {
  //       if (loading || end) return; // 判断是否在请求状态或者已到最后一页
  //       setEnd_time(Start_time + 1);
  //     }
  //   },
  //   [loading, Start_time, setEnd_time, end],
  // );

  const onRefreshClick = useCallback(() => {
    dispatch(fetchAllianceViewAsync());
  }, [dispatch]);

  const steps = React.useMemo(
    () => [
      {
        element: '.battle-items-0',
        intro: t('Click to view battle details.'),
      },
    ],
    [t],
  );
  // 添加事件监听，用于更新状态
  useEffect(() => {
    eventBus.addEventListener('onRefresh', onRefreshClick);
    return () => {
      eventBus.removeEventListener('onRefresh', onRefreshClick);
    };
  }, [onRefreshClick]);

  useEffect(() => {
    return () => {
      dispatch(
        storeAction.toggleVisible({ visible: false, lastStep: steps.length }),
      );
    };
  }, [dispatch, steps.length]);

  return (
    <Box pt='20px'>
      {!guides.guideFinish &&
        guides.finish &&
        steps.length - 1 >= guides.step &&
        RecordList.length > 0 && (
          <Steps
            enabled={stepsEnabled}
            steps={steps}
            initialStep={0}
            options={{
              exitOnOverlayClick: false,
            }}
            onExit={step => {
              setStepsEnabled(false);
              setGuide(step + 1);
            }}
          />
        )}

      <BattleTop
        cont={{ Cont, WinCont, FailedCont }}
        upDate={e => {
          setStart_time(e);
          setEnd_time(e);
        }}
      />
      {/* <Box>
        <BgCard variant='Fullscreen' padding='40px 37px'>
          
        </BgCard>
      </Box> */}
      <ScrollBox className='Pk_list'>
        {(RecordList ?? []).map((item, index) => (
          <RowFlex key={item.id}>
            <InProgress info={item} />
            {(item.plunder ?? []).map(info => (
              <>
                <PkBox key={info.createTime} info={info} />
              </>
            ))}
          </RowFlex>
        ))}
      </ScrollBox>
      {loading && (
        <LoadingBox>
          <Spinner size={200} />
        </LoadingBox>
      )}
    </Box>
  );
};

export default BattleReport;
