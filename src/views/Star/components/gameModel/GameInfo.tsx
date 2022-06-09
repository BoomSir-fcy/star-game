import React, { useCallback } from 'react';
import styled, { css } from 'styled-components';
import { useDispatch } from 'react-redux';
import { Flex, Box, Card, Text, Image, Button, Progress } from 'uikit';
import { useToast } from 'contexts/ToastsContext';
import { useStore, storeAction } from 'state';
import { Api } from 'apis';

import { fetchPlanetBuildingsAsync } from 'state/buildling/fetchers';
import { useTranslation } from 'contexts/Localization';

import { BuildingDetailType } from 'state/types';
import { useBuildingUpgrade, useBuildingOperate } from './hooks';

import { GameThing, ThingRepair, BuildingValue } from '..';
import { ThingDestoryModal, ThingUpgradesModal, CancelModal } from '../Modal';

import { useWorkqueue } from '../hooks';

const Container = styled(Box)`
  width: 852px;
  min-height: 470px;
  max-height: 476px;
  padding: 13px;
  border: 4px solid #f9feff;
  box-shadow: ${({ theme }) => theme.shadows.highlight};
  overflow: auto;
`;

const CardContent = styled(Card)`
  border-radius: 0;
  padding: 10px 16px;
`;

const CardInfo = styled(Card)`
  border-radius: 0;
  padding: 0 36px;
  height: 175px;
  border: 1px solid #282a30;
`;

const ItemInfo = styled(Flex)<{ bottomMargin?: boolean }>`
  width: 50%;
  justify-content: flex-start;
  align-items: center;
  ${({ bottomMargin }) =>
    !bottomMargin &&
    css`
      margin-bottom: 10px;
    `}
`;

const StyledImage = styled(Image)`
  flex-shrink: 0;
  margin-right: 9px;
`;

const ActionButton = styled(Button)`
  width: 170px;
  height: 44px;
  padding: 0;
  font-size: 16px;
  &:first-child {
    margin-bottom: 10px;
  }
`;

export const GameInfo: React.FC<{
  building_id: string;
  planet_id: number;
  currentBuild: Api.Building.Building;
  diffTime?: number;
  callback: () => void;
  onUpgradeLevel: () => void;
}> = React.memo(
  ({
    building_id,
    planet_id,
    currentBuild,
    diffTime,
    callback,
    onUpgradeLevel,
  }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { toastSuccess, toastError } = useToast();
    const { upgrade } = useBuildingUpgrade();
    const { cancelWorkQueue } = useWorkqueue();
    const { destory, upgrade: upgradeBuilding } = useBuildingOperate();
    const selfBuilding = useStore(p => p.buildling?.selfBuildings?.buildings);
    const planetAssets = useStore(p => p.buildling.planetAssets);
    let timer: any = null;

    const [state, setState] = React.useState({
      upgradesVisible: false,
      cancelVisible: false,
      upgrade: {} as any,
      time: diffTime || 0,
    });

    const [cancelVisible, setCancelVisible] = React.useState(false);
    const { upgrade_need } = state.upgrade?.estimate_building_detail || {};
    const currentBuilding = selfBuilding?.find(
      (row: any) => row?.building?._id === building_id,
    )?.building;

    const itemData = React.useMemo(() => {
      return { ...currentBuilding, ...currentBuild };
    }, [currentBuild, currentBuilding]);
    const progressTime = itemData?.work_end_time - itemData?.work_start_time;

    const init = useCallback(async () => {
      if (itemData?.iscreate) {
        const res = await upgrade(planet_id, building_id);
        setState({ ...state, upgrade: res });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [upgrade, planet_id, building_id, itemData]);

    React.useEffect(() => {
      if (itemData?._id && !itemData?.isactive) {
        init();
      }
    }, [itemData, init]);

    // 销毁建筑
    const destoryBuilding = async () => {
      try {
        const res = await destory({
          planet_id,
          build_type: itemData?.type,
          building_setting: [building_id],
        });
        if (Api.isSuccess(res)) {
          callback();
          getSelfBuilding();
          toastSuccess(t('planetDestroyedSuccessfully'));
          dispatch(storeAction.destoryBuildingVisibleModal(false));
        } else {
          toastError(res.message);
        }
      } catch (error) {
        console.error(error);
      }
    };

    // 建筑等级提升
    const upgradeLevelBuilding = async () => {
      try {
        const res = await upgradeBuilding({
          planet_id,
          building_id,
        });
        if (Api.isSuccess(res)) {
          getSelfBuilding();
          toastSuccess(t('planetBuildingBeingUpgraded'));
          setState({ ...state, upgradesVisible: false });
        } else {
          toastError(res.message);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const getSelfBuilding = () => {
      dispatch(fetchPlanetBuildingsAsync(planet_id));
    };

    const formatTime = (time: number) => {
      const hour = Math.floor(time / 3600);
      const min = Math.floor((time % 3600) / 60);
      const sec = time % 60;
      return `${hour}h:${min}m:${sec}s`;
    };

    // 取消建筑升级、建造
    const cancelBuildingQueue = async () => {
      try {
        const res = await cancelWorkQueue(planet_id, itemData?.work_queue_id);
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    };

    // 倒计时
    const countDownNumber = () => {
      if (diffTime <= 0) {
        setState({
          ...state,
          time: 0,
        });
        clearTimeout(timer);
        return;
      }
      // eslint-disable-next-line no-param-reassign
      diffTime--;
      setState({
        ...state,
        time: diffTime,
      });
      timer = setTimeout(() => {
        countDownNumber();
      }, 1000);
    };

    React.useEffect(() => {
      if (diffTime > 0) {
        countDownNumber();
      }
      return () => clearTimeout(timer);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [diffTime]);

    // console.log('gameisbuilding', itemData);
    return (
      <Container>
        {itemData?._id && (
          <>
            <CardContent>
              <Flex alignItems='flex-start'>
                <GameThing
                  src={itemData?.picture}
                  level={itemData?.propterty?.levelEnergy}
                  scale='md'
                  border
                />
                <Box ml='36px' style={{ flex: 1 }}>
                  <Flex
                    alignItems='flex-end'
                    justifyContent='space-between'
                    mb='10px'
                  >
                    <Flex alignItems='flex-end'>
                      <Text bold shadow='primary'>
                        {itemData?.propterty?.name_cn}
                      </Text>
                      <Text ml='27px' small>
                        {`${itemData?.propterty?.size.area_x}x${itemData?.propterty?.size.area_y}`}
                      </Text>
                    </Flex>
                    {!itemData.isbuilding && !itemData?.work_queue_id && (
                      <Text bold small shadow='primary'>
                        {t('NotYetBuilt')}
                      </Text>
                    )}

                    {itemData?.work_queue_id && itemData?.work_end_time && (
                      <Text bold small shadow='primary'>
                        {t('DuringUpgrade')}
                      </Text>
                    )}
                    {state.upgrade?.building_detail?._id && (
                      <Text shadow='primary' bold fontSize='22px'>
                        {t('LevelPreview', {
                          level: itemData?.propterty?.levelEnergy + 1,
                        })}
                      </Text>
                    )}
                  </Flex>
                  <Flex flex={1} justifyContent='space-between' flexWrap='wrap'>
                    {/* 矿石建筑 */}
                    {BuildingDetailType.BuildingDetailTypeStone ===
                      itemData?.detail_type && (
                      <ItemInfo>
                        <BuildingValue
                          itemData={itemData}
                          planet_id={planet_id}
                          title={t('Ore Capacity')}
                          value={`${itemData?.stone?.product?.per_sec_ouput_stone}/s`}
                          icon='/images/commons/icon/icon_minera.png'
                        />
                      </ItemInfo>
                    )}
                    {/* 生产能量 */}
                    {BuildingDetailType.BuildingDetailTypeEnergy ===
                      itemData?.detail_type && (
                      <ItemInfo>
                        <BuildingValue
                          itemData={itemData}
                          planet_id={planet_id}
                          title={t('Energy Capacity')}
                          value={`${itemData?.stone?.product?.per_sec_ouput_energy}/s`}
                          icon='/images/commons/icon/icon_energy.png'
                        />
                      </ItemInfo>
                    )}
                    {/* 生产香料 */}
                    {BuildingDetailType.BuildingDetailTypePopulation ===
                      itemData?.detail_type && (
                      <ItemInfo>
                        <BuildingValue
                          itemData={itemData}
                          planet_id={planet_id}
                          title={t('Population Capacity')}
                          value={`${itemData?.stone?.product?.per_sec_ouput_population}/s`}
                          icon='/images/commons/icon/icon_spice.png'
                        />
                      </ItemInfo>
                    )}
                    <ItemInfo>
                      <BuildingValue
                        itemData={itemData}
                        planet_id={planet_id}
                        title={t('planetDurability')}
                        value={`${itemData?.propterty?.now_durability}/${itemData?.propterty?.max_durability}`}
                        addedValue={
                          state.upgrade?.estimate_building_detail
                            ?.max_durability -
                          itemData?.propterty?.max_durability
                        }
                        icon='/images/commons/star/durability.png'
                        isRepair
                      />
                    </ItemInfo>
                    <ItemInfo bottomMargin>
                      <BuildingValue
                        itemData={itemData}
                        planet_id={planet_id}
                        title={t('planetEnergyConsumption')}
                        value={`${itemData?.propterty?.per_cost_energy}/s`}
                        addedValue={
                          state.upgrade?.estimate_building_detail?.propterty
                            ?.per_cost_energy -
                          itemData?.propterty?.per_cost_energy
                        }
                        icon='/images/commons/icon/icon_energy.png'
                      />
                    </ItemInfo>
                    <ItemInfo bottomMargin>
                      <BuildingValue
                        itemData={itemData}
                        planet_id={planet_id}
                        title={t('planetPopulationConsumption')}
                        value={`${itemData?.propterty?.per_cost_population}/s`}
                        addedValue={
                          state.upgrade?.estimate_building_detail?.propterty
                            ?.per_cost_population -
                          itemData?.propterty?.per_cost_population
                        }
                        icon='/images/commons/icon/icon_spice.png'
                      />
                    </ItemInfo>
                  </Flex>
                  <Box>
                    <Text color='textSubtle' small mt='5px'>
                      {t('planetResourcesProducedPlanetaryBuildings')}
                    </Text>
                  </Box>
                </Box>
              </Flex>
            </CardContent>
            <CardInfo>
              {!itemData?.isbuilding && !itemData?.work_queue_id && (
                <>
                  <Flex mt='21px' mb='15px' alignItems='flex-end'>
                    <Text bold fontSize='24px' shadow='primary'>
                      {t('ConstructionRequirements')}
                    </Text>
                    <Text ml='16px' fontSize='16px' mb='2px'>
                      {t('TimeCnsumingBuild', {
                        time: formatTime(itemData?.upgrade_need?.upgrade_time),
                      })}
                    </Text>
                  </Flex>
                  <Text
                    fontSize='16px'
                    mb='5px'
                    color={`${
                      planetAssets?.energy <
                        itemData?.upgrade_need?.upgrade_energy && 'warning'
                    }`}
                  >
                    {t('EnergyRequiredBuild', {
                      value: `${itemData?.upgrade_need?.upgrade_energy}/${planetAssets?.energy}`,
                    })}
                  </Text>
                  <Text
                    fontSize='16px'
                    mb='5px'
                    color={`${
                      planetAssets?.stone <
                        itemData?.upgrade_need?.upgrade_stone && 'warning'
                    }`}
                  >
                    {t('OreRequiredConstruction', {
                      value: `${itemData?.upgrade_need?.upgrade_stone}/${planetAssets?.stone}`,
                    })}
                  </Text>
                  <Text
                    fontSize='16px'
                    mb='5px'
                    color={`${
                      planetAssets?.population <
                        itemData?.upgrade_need?.upgrade_population && 'warning'
                    }`}
                  >
                    {t('SpicesNeededToBuild', {
                      value: `${itemData?.upgrade_need?.upgrade_population}/${planetAssets?.population}`,
                    })}
                  </Text>
                </>
              )}

              {/* 取消升级、创建建筑 */}
              {itemData?.work_queue_id && (
                <Flex
                  justifyContent='space-between'
                  alignItems='center'
                  style={{
                    minHeight: 175,
                  }}
                >
                  <Flex flexDirection='column' width='388px'>
                    <Flex alignItems='center' mb='27px'>
                      <Text shadow='primary' bold fontSize='34px'>
                        Lv {itemData?.propterty?.levelEnergy}
                      </Text>
                      <Box width='47px' height='40px' margin='0 40px'>
                        <Image
                          src='/images/commons/icon/icon-upgrade.png'
                          width={47}
                          height={40}
                        />
                      </Box>
                      <Text shadow='primary' bold fontSize='34px'>
                        Lv {itemData?.propterty?.levelEnergy + 1}
                      </Text>
                    </Flex>
                    <Progress
                      color='progressGreenBar'
                      variant='round'
                      scale='md'
                      linear
                      primaryStep={
                        Math.round(
                          ((progressTime - state.time) / progressTime) * 10000,
                        ) / 100
                      }
                    />
                    <Text mt='17px' fontSize='17px'>
                      {t('TimeLeft', { time: formatTime(state.time) })}
                    </Text>
                  </Flex>
                  {/* <ActionButton
                    disabled={itemData?.isactive}
                    variant='danger'
                    onClick={() => setCancelVisible(true)}
                  >
                    {t('CancelUpgrade')}
                  </ActionButton> */}
                </Flex>
              )}

              {state.upgrade?.building_detail?._id && (
                <Flex
                  justifyContent='space-between'
                  alignItems='center'
                  style={{
                    minHeight: 175,
                  }}
                >
                  <Flex flexDirection='column'>
                    <Flex alignItems='center' mb='5px'>
                      <Text shadow='primary' bold fontSize='34px'>
                        Lv {itemData?.propterty?.levelEnergy}
                      </Text>
                      <Box width='47px' height='40px' margin='0 40px'>
                        <Image
                          src='/images/commons/icon/icon-upgrade.png'
                          width={47}
                          height={40}
                        />
                      </Box>
                      <Text shadow='primary' bold fontSize='34px'>
                        Lv {itemData?.propterty?.levelEnergy + 1}
                      </Text>
                    </Flex>
                    <Text fontSize='17px'>
                      {t('TimeConsumingUpgrade', {
                        time: formatTime(upgrade_need?.upgrade_time),
                      })}
                    </Text>
                    {upgrade_need?.upgrade_energy > 0 && (
                      <Text
                        fontSize='17px'
                        color={`${
                          planetAssets?.energy < upgrade_need?.upgrade_energy &&
                          'warning'
                        }`}
                      >
                        {t('EnergyRequiredUpgrade', {
                          value: `${upgrade_need?.upgrade_energy} / ${planetAssets?.energy}`,
                        })}
                      </Text>
                    )}
                    {upgrade_need?.upgrade_population > 0 && (
                      <Text
                        fontSize='17px'
                        color={`${
                          planetAssets?.population <
                            upgrade_need?.upgrade_population && 'warning'
                        }`}
                      >
                        {t('SpiceRequiredUpgrade', {
                          value: `${upgrade_need?.upgrade_population} / ${planetAssets?.population}`,
                        })}
                      </Text>
                    )}
                    {upgrade_need?.upgrade_stone > 0 && (
                      <Text
                        fontSize='17px'
                        color={`${
                          planetAssets?.stone < upgrade_need?.upgrade_stone &&
                          'warning'
                        }`}
                      >
                        {t('OreRequiredUpgrade', {
                          value: `${upgrade_need?.upgrade_stone} / ${planetAssets?.stone}`,
                        })}
                      </Text>
                    )}
                  </Flex>
                  <Flex flexDirection='column'>
                    <ActionButton
                      disabled={!state.upgrade?.estimate_building_detail?._id}
                      onClick={() =>
                        setState({ ...state, upgradesVisible: true })
                      }
                    >
                      {t('planetBuildingUpgrades')}
                    </ActionButton>

                    <ActionButton
                      disabled={itemData?.isactive}
                      variant='danger'
                      onClick={() =>
                        dispatch(storeAction.destoryBuildingVisibleModal(true))
                      }
                    >
                      {t('planetDestroyBuilding')}
                    </ActionButton>
                  </Flex>
                </Flex>
              )}
            </CardInfo>
          </>
        )}

        {/* 销毁建筑 */}
        <ThingDestoryModal
          planet_id={planet_id}
          itemData={itemData}
          upgrade={state.upgrade}
          onChange={destoryBuilding}
          onClose={() =>
            dispatch(storeAction.destoryBuildingVisibleModal(false))
          }
        />

        {/* 建筑升级 */}
        <ThingUpgradesModal
          visible={state.upgradesVisible}
          planet_id={planet_id}
          itemData={itemData}
          upgrade={state.upgrade}
          onChange={() => {
            setState({ ...state, upgradesVisible: false });
            onUpgradeLevel();
          }}
          onClose={() => setState({ ...state, upgradesVisible: false })}
        />

        {/* 取消建筑升级&&建造 */}
        <CancelModal
          visible={cancelVisible}
          title='取消升级'
          content='将停止当前建筑的队列任务，并且无法收回已支出资源。
是否取消当前建筑任务？'
          onClose={() => setCancelVisible(false)}
          onComplete={cancelBuildingQueue}
        />
      </Container>
    );
  },
);
