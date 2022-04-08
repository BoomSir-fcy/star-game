import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Flex, Box, Text } from 'uikit';

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
  const { setRepairQuick } = useBuildingRepair();
  const { setBuildingQuick } = useBuildingOperate();
  const [state, setState] = React.useState({
    time: 0,
  });
  const { status } = itemData;
  let timer = null as any;

  React.useEffect(() => {
    if (status?.count_down) {
      const { count_down } = status;
      setState({ ...state, time: count_down });
    }
    return () => {
      clearInterval(timer);
    };
  }, [itemData?.status]);

  React.useEffect(() => {
    if (state.time > 0) {
      countDown();
    }
  }, [state.time]);

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
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  // 快速升级
  const handleUpgrade = async () => {
    try {
      const res = await setBuildingQuick({
        planet_id,
        building_id: itemData._id,
      });
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Flex data-id={index} data-item={JSON.stringify(itemData)}>
      {level && (
        <Level shadow='primary' small>
          Lv {level}
        </Level>
      )}
      {state?.time > 0 && (
        <ToolBar
          onClick={status?.upgrade_type === 1 ? handleUpgrade : handleRepair}
        >
          <Text small>{formatTime(state.time)}</Text>
        </ToolBar>
      )}

      {/* 耐久度修复 */}
      {itemData?.propterty?.max_durability < 100 && (
        <ToolBar>
          <ThingRepair
            itemData={itemData}
            planet_id={planet_id}
            building_id={itemData._id}
            onCallback={() => {
              console.log(22);
            }}
          />
        </ToolBar>
      )}
      <img src={src} alt='' />
    </Flex>
  );
});
