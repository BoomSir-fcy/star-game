import React from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { Flex, Box, Text } from 'uikit';
import { useToast } from 'contexts/ToastsContext';
import { useTranslation } from 'contexts/Localization';
import { Api } from 'apis';

import { fetchPlanetBuildingsAsync } from 'state/buildling/fetchers';
import { ThingRepair } from '../planet/ThingRepair';

import { useBuildingRepair, useBuildingOperate } from './hooks';

const Level = styled(Text)`
  position: absolute;
  z-index: 99;
  top: 12px;
  left: 15px;
`;

const ToolBar = styled(Box)`
  position: absolute;
  z-index: 99;
  top: 12px;
  right: 8px;
`;

export const Building: React.FC<{
  planet_id: number;
  itemData: Api.Building.Building;
  src: string;
  index?: number;
  level?: number;
  active?: boolean;
  onClick?: () => void;
}> = React.memo(({ planet_id, itemData, index, src, level }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { setRepairQuick } = useBuildingRepair();
  const { setBuildingQuick } = useBuildingOperate();
  const { toastSuccess, toastError } = useToast();
  const [state, setState] = React.useState({
    time: 0,
  });
  const { status } = itemData;
  let timer = null as any;

  // 倒计时
  const countDown = () => {
    timer = setInterval(() => {
      const { time } = state;
      clearInterval(timer);
      setState({
        ...state,
        time: time - 1,
      });
    }, 1000);
  };

  React.useEffect(() => {
    const { count_down } = status || {};
    setState({ ...state, time: count_down || 0 });
    return () => {
      clearInterval(timer);
    };
    // eslint-disable-next-line
  }, [status, timer]);

  React.useEffect(() => {
    if (state.time > 0) {
      countDown();
    }
    // eslint-disable-next-line
  }, [state.time]);

  const formatTime = (time: number) => {
    const hour = Math.floor(time / 3600);
    const min = Math.floor((time % 3600) / 60);
    const sec = time % 60;
    return `${hour}:${min < 10 ? `0${min}` : min}:${
      sec < 10 ? `0${sec}` : sec
    }`;
  };

  // 快速修复耐久
  const handleRepair = async () => {
    try {
      const res = await setRepairQuick({
        planet_id,
        building_id: itemData._id,
      });
      if (Api.isSuccess(res)) {
        dispatch(fetchPlanetBuildingsAsync(planet_id));
        toastSuccess(t('planetQuickFixSuccessful'));
      } else {
        toastError(res.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 快速升级
  const handleUpgrade = async () => {
    try {
      const res = await setBuildingQuick({
        planet_id,
        building_id: itemData._id,
      });
      if (Api.isSuccess(res)) {
        dispatch(fetchPlanetBuildingsAsync(planet_id));
        toastSuccess(t('planetQuickUpgradeSuccessfully'));
      } else {
        toastError(res.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Flex height='100%' alignItems='center'>
      {level && (
        <Level shadow='primary' bold>
          Lv {level}
        </Level>
      )}

      {!itemData?.isactive && (
        <>
          {state?.time > 0 && (
            <ToolBar
            // onClick={() => {
            //   clearInterval(timer);
            //   setState({ ...state, time: 0 });
            //   if (status?.upgrade_type === 1) {
            //     handleUpgrade();
            //   } else {
            //     handleRepair();
            //   }
            // }}
            >
              <Text small>{formatTime(state.time)}</Text>
            </ToolBar>
          )}

          {/* 耐久度修复 */}
          {state?.time <= 0 &&
            itemData?.propterty?.max_durability !==
              itemData?.propterty?.now_durability && (
              <ToolBar>
                <ThingRepair
                  itemData={itemData}
                  planet_id={planet_id}
                  building_id={itemData._id}
                  onCallback={() => {
                    dispatch(fetchPlanetBuildingsAsync(planet_id));
                  }}
                />
              </ToolBar>
            )}
        </>
      )}

      <img src={src} alt='' />
    </Flex>
  );
});
