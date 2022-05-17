import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { BgCard, Box, Flex, Spinner, Text } from 'uikit';
import { useFetchAllianceView } from 'state/alliance/hooks';
import { useDispatch } from 'react-redux';
import { fetchAllianceViewAsync } from 'state/alliance/reducer';
import eventBus from 'utils/eventBus';
import { PkBox } from './pkBox';
import { BattleTop } from './BattleTop';

const PkList = [
  {
    battle_result: true,
    startingTime: 1652686766,
    endTime: 1652686820,
    ore: 10,
    energy: 20,
    attrition_combat: 2,
    LoseDurability: 6,
    id: 1,
  },
  {
    battle_result: false,
    startingTime: 1652686766,
    endTime: 1652686820,
    ore: 10,
    energy: 20,
    attrition_combat: 2,
    LoseDurability: 6,
    id: 1,
  },
  {
    battle_result: false,
    startingTime: 1652686766,
    endTime: 1652686820,
    ore: 10,
    energy: 20,
    attrition_combat: 2,
    LoseDurability: 6,
    id: 1,
  },
  {
    battle_result: false,
    startingTime: 1652686766,
    endTime: 1652686820,
    ore: 10,
    energy: 20,
    attrition_combat: 2,
    LoseDurability: 6,
    id: 1,
  },
  {
    battle_result: false,
    startingTime: 1652686766,
    endTime: 1652686820,
    ore: 10,
    energy: 20,
    attrition_combat: 2,
    LoseDurability: 6,
    id: 1,
  },
  {
    battle_result: false,
    startingTime: 1652686766,
    endTime: 1652686820,
    ore: 10,
    energy: 20,
    attrition_combat: 2,
    LoseDurability: 6,
    id: 1,
  },
];

const ScrollBox = styled(Flex)`
  height: 650px;
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
  const [pending, setpending] = useState(false);

  const onRefreshClick = useCallback(() => {
    dispatch(fetchAllianceViewAsync());
  }, [dispatch]);

  // 添加事件监听，用于更新状态
  useEffect(() => {
    eventBus.addEventListener('onRefresh', onRefreshClick);
    return () => {
      eventBus.removeEventListener('onRefresh', onRefreshClick);
    };
  }, [onRefreshClick]);

  return (
    <Box pt='20px'>
      <BattleTop />
      <Flex flex={1}>
        <BgCard variant='Fullscreen' padding='40px 37px'>
          <ScrollBox className='Pk_list'>
            {(PkList ?? []).map(item => (
              <React.Fragment key={`${item.id}`}>
                <ItemBox>
                  <PkBox info={item} />
                </ItemBox>
              </React.Fragment>
            ))}
          </ScrollBox>
        </BgCard>
      </Flex>
      {pending && (
        <LoadingBox>
          <Spinner size={200} />
        </LoadingBox>
      )}
    </Box>
  );
};

export default BattleReport;
