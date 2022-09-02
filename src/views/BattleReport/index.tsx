import React, { useState, useCallback, useEffect, useMemo } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { BgCard, Box, Empty, Flex, Spinner, Text } from 'uikit';
import { useStore, storeAction } from 'state';
import {
  useFetchAllianceView,
  useFetchCombatRecord,
} from 'state/alliance/hooks';
import moment from 'moment';
import { fetchAllianceViewAsync } from 'state/alliance/reducer';
import eventBus from 'utils/eventBus';
import { Steps, Hints } from 'intro.js-react'; // 引入我们需要的组件
import { useGuide } from 'hooks/useGuide';
import { useTranslation } from 'contexts/Localization';
import { useFetchGalaxReportList } from 'state/galaxy/hooks';
import useParsedQueryString from 'hooks/useParsedQueryString';
import { PkBox } from './pkBox';
import { BattleTop } from './BattleTop';
import { InProgress } from './components/inProgress';
import 'intro.js/introjs.css';
import { GalaxyInProgress } from './components/GalaxyInProgress';

const GlobalStyle = createGlobalStyle<{
  interactive?: boolean;
  disabled?: boolean;
}>`
  ${({ disabled }) => {
    return disabled
      ? `
    .introjs-nextbutton {
      pointer-events: none !important;
      color: #9e9e9e !important;
      cursor: default !important;
    }
    `
      : '';
  }};


  ${({ interactive }) => {
    return interactive
      ? `
    *{
      pointer-events: none;
    }
    .introjs-showElement, .introjs-showElement *, .introjs-tooltip, .introjs-tooltip *{
      pointer-events: auto;
    }
    `
      : '';
  }};
  
`;

const ScrollBox = styled(Box)`
  height: calc(940px - 160px);
  margin-top: 22px;
  overflow-y: auto;
  overflow-x: hidden;
  padding-left: 30px;
  &::-webkit-scrollbar {
    height: 0;
  }
`;

const RowFlex = styled(Flex)`
  overflow-x: auto;
  height: max-content;
  background: linear-gradient(270deg, #162d37, #0b1c22, #0a161b);
  border: 2px solid ${({ theme }) => theme.colors.borderPrimary};
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
  const paramsQs = useParsedQueryString();

  const { pkRecord } = useStore(p => p.alliance);
  const {
    record: RecordList,
    failed_count: FailedCont,
    win_count: WinCont,
    count: Cont,
    isEnd: end,
    loading,
  } = pkRecord;

  const { GalaxReportList } = useStore(p => p.galaxy);
  const { guides, setGuide } = useGuide(location.pathname);
  const [stepsEnabled, setStepsEnabled] = useState(true);
  const [Start_time, setStart_time] = useState<number>(
    moment(Number(paramsQs.starTime) * 1000).unix() ||
      moment(new Date(new Date().toLocaleDateString()).getTime()).unix(),
  );
  const [End_time, setEnd_time] = useState<number>(
    moment(Number(paramsQs.endTime) * 1000).unix() ||
      moment(
        (new Date(new Date().toLocaleDateString()).getTime() / 1000 + 86400) *
          1000,
      ).unix(),
  );
  const [activeStep, setActiveStep] = useState(guides.step);

  useFetchCombatRecord(Start_time, End_time);
  useFetchGalaxReportList(Start_time, End_time);
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

  const ShowBoot = useMemo(() => {
    if (RecordList.length > 0 && RecordList[0]?.plunder.length > 0) {
      return true;
    }
    return false;
  }, [RecordList]);

  const onRefreshClick = useCallback(() => {
    dispatch(fetchAllianceViewAsync());
  }, [dispatch]);

  const HaveDetileGalaxReportList = React.useMemo(() => {
    const arr = GalaxReportList.filter(i => i?.detail?.length !== 0);
    return arr;
  }, [GalaxReportList]);

  const steps = React.useMemo(
    () => [
      {
        element: '.battle-items-0',
        intro: t('Click to view battle details.'),
        interactive: true,
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
    <Box pt='20px' height='940px'>
      {!guides.guideFinish &&
        guides.finish &&
        steps.length - 1 >= guides.step &&
        ShowBoot && (
          <>
            <GlobalStyle
              interactive={steps[activeStep]?.interactive && stepsEnabled}
            />
            <Steps
              enabled={stepsEnabled}
              steps={steps}
              initialStep={0}
              options={{
                exitOnOverlayClick: false,
              }}
              onBeforeChange={event => {
                setActiveStep(event);
              }}
              onExit={step => {
                setStepsEnabled(false);
                setGuide(step + 1);
              }}
            />
          </>
        )}

      <BattleTop
        cont={{ Cont, WinCont, FailedCont }}
        Start_time={Start_time}
        End_time={End_time}
        setStart_time={e => {
          setStart_time(e);
        }}
        setEnd_time={e => {
          setEnd_time(e);
        }}
      />

      <ScrollBox className='Pk_list' pb={20}>
        {RecordList.length > 0 || HaveDetileGalaxReportList.length > 0 ? (
          <>
            {(RecordList ?? []).map((item, index) => (
              <RowFlex key={item.id}>
                <InProgress info={item} />
                {(item.plunder ?? []).map((info, index2) => (
                  <PkBox
                    First={index === 0 && index2 === 0}
                    key={info.createTime}
                    info={info}
                  />
                ))}
              </RowFlex>
            ))}
            {(HaveDetileGalaxReportList ?? []).map((item, index) => (
              <RowFlex key={item.id}>
                <GalaxyInProgress info={item} />
              </RowFlex>
            ))}
          </>
        ) : (
          <Empty />
        )}
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
