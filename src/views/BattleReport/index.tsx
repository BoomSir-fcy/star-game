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

const ScrollBox = styled(Flex)`
  min-height: 400px;
  max-height: 650px;
  margin-top: 22px;
  overflow-y: auto;
  flex-wrap: wrap;
  align-content: flex-start;
  justify-content: space-around;
`;

const ItemBox = styled(Box)`
  display: block;
  height: auto;
  margin-bottom: 20px;
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
    page: StatePage,
  } = pkRecord;

  const { guides, setGuide } = useGuide(location.pathname);
  const [stepsEnabled, setStepsEnabled] = useState(true);
  const [page, setPageNum] = useState<number>(1);
  const [page_size, setPageSize] = useState<number>(10);

  useFetchCombatRecord(page, page_size);

  const loadMore = useCallback(
    (e: any) => {
      const { offsetHeight, scrollTop, scrollHeight } = e.nativeEvent.target;
      if (offsetHeight + scrollTop === scrollHeight) {
        if (loading || end) return; // 判断是否在请求状态或者已到最后一页
        setPageNum(page + 1);
      }
    },
    [loading, page, setPageNum, end],
  );

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

  useEffect(() => {
    setPageNum(StatePage);
  }, [StatePage, setPageNum]);

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
              setGuide(step);
            }}
          />
        )}

      <BattleTop
        cont={{ Cont, WinCont, FailedCont }}
        upDate={e => setPageNum(e)}
      />
      <Flex flex={1}>
        <BgCard variant='Fullscreen' padding='40px 37px'>
          <ScrollBox onScroll={loadMore} className='Pk_list'>
            {(RecordList ?? []).map((item, index) => (
              <React.Fragment key={`${item.id}`}>
                <ItemBox className={`battle-items-${index}`}>
                  <PkBox info={item} />
                </ItemBox>
              </React.Fragment>
            ))}
          </ScrollBox>
        </BgCard>
      </Flex>
      {loading && (
        <LoadingBox>
          <Spinner size={200} />
        </LoadingBox>
      )}
    </Box>
  );
};

export default BattleReport;
