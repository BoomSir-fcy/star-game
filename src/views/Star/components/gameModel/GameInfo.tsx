import React, { useCallback } from 'react';
import BigNumber from 'bignumber.js';
import styled, { css } from 'styled-components';
import { useDispatch } from 'react-redux';
import { Flex, Box, Card, Text, Image, Button, Progress } from 'uikit';
import { useToast } from 'contexts/ToastsContext';
import { useStore, storeAction } from 'state';
import { Api } from 'apis';

import { fetchPlanetBuildingsAsync } from 'state/buildling/fetchers';
import { fetchPlanetInfoAsync } from 'state/planet/fetchers';
import { useTranslation } from 'contexts/Localization';

import { BuildingDetailType } from 'state/types';
import { formatDisplayApr } from 'utils/formatBalance';
import { useBuildingUpgrade, useBuildingOperate } from './hooks';

import { GameThing, BuildingValue } from '..';
import { ThingDestoryModal, ThingUpgradesModal } from '../Modal';

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
  currentQueue: any[];
  gridBuilds: Api.Building.Building[];
  diffTime?: number;
  callback: () => void;
  onCancelQueue: (currentBuilding?: any) => void;
  onUpgradeLevel: (currentBuilding: any) => void;
}> = React.memo(
  ({
    building_id,
    planet_id,
    currentBuild,
    currentQueue,
    gridBuilds,
    diffTime,
    callback,
    onCancelQueue,
    onUpgradeLevel,
  }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { toastSuccess, toastError } = useToast();
    const { upgrade } = useBuildingUpgrade();
    const { destory } = useBuildingOperate();
    const selfBuilding = useStore(p => p.buildling?.selfBuildings?.buildings);
    const planetAssets = useStore(p => p.buildling.planetAssets);
    const planet = useStore(p => p.planet.planetInfo[planet_id ?? 0]);

    // 获取已经创建的所有储物罐
    const storage = gridBuilds.filter(
      ({ detail_type, building }) =>
        detail_type === BuildingDetailType.BuildingDetailTypeStore &&
        building?._id,
    );
    // 获取星球所有地窖
    const cellar = gridBuilds.filter(
      ({ detail_type, building }) =>
        detail_type === BuildingDetailType.BuildingDetailTypeCellar &&
        building?._id,
    );

    let timer: any = null;

    const [state, setState] = React.useState({
      upgradesVisible: false,
      cancelVisible: false,
      upgrade: {} as any,
    });
    const [currentTime, setCurrentTime] = React.useState(diffTime || 0);
    const [arms, setArms] = React.useState([]);
    // const [cancelVisible, setCancelVisible] = React.useState(false);
    const { upgrade_need } = state.upgrade?.estimate_building_detail || {};
    const currentBuilding = selfBuilding?.find(
      (row: any) => row?.building?._id === building_id,
    )?.building;

    const itemData = React.useMemo(() => {
      return { ...currentBuilding, ...currentBuild };
    }, [currentBuild, currentBuilding]);

    const currentAttributes = state.upgrade?.building_detail || itemData;
    const progressTime = itemData?.work_end_time - itemData?.work_start_time;

    const init = useCallback(
      async (target_level?: number) => {
        const buildingsId =
          itemData?.work_queue_id || itemData?.work_add_time
            ? itemData?.buildings_id || itemData?._id
            : building_id;

        if (buildingsId) {
          // 获取当前建筑的最高等级
          let selfLevel = '';
          // 已经成功创建队列
          if (itemData?.work_queue_id && itemData?.target_level) {
            selfLevel = itemData?.target_level;
          }

          // 为成功创建到队列里面
          if (itemData?.work_queue_id && !itemData?.target_level) {
            selfLevel = itemData?.propterty?.levelEnergy + 1;
          }

          // 队列有正在升级的建筑
          // 已经创建建筑加入队列，获取加入队列的最高建筑信息
          const taregtBuildings = currentQueue.filter(
            ({ _id, buildings_id, work_type }) =>
              (_id === itemData?._id || buildings_id === itemData?._id) &&
              work_type === 2,
          );
          const taregtBuildingLevel = taregtBuildings?.sort(
            (a, b) =>
              b?.propterty?.levelEnergy - a?.propterty?.levelEnergy ||
              b?.target_level - a?.target_level,
          );
          if (
            itemData?.building?._id &&
            !itemData.isqueue &&
            taregtBuildingLevel.length > 0
          ) {
            selfLevel =
              taregtBuildingLevel[0]?.propterty?.levelEnergy + 2 ||
              taregtBuildingLevel[0]?.target_level + 1;
          }

          console.log(itemData, '建筑', selfLevel);
          const res = await upgrade(
            planet_id,
            buildingsId,
            target_level || selfLevel,
          );
          setState({ ...state, upgrade: res });
          setArms(res?.building_detail?.petri_dish?.arms || []);
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [upgrade, planet_id, building_id, itemData],
    );

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

    const getSelfBuilding = () => {
      dispatch(fetchPlanetInfoAsync([planet_id]));
      dispatch(fetchPlanetBuildingsAsync(planet_id));
    };

    const formatTime = (time: number) => {
      const hour = Math.floor(time / 3600);
      const min = Math.floor((time % 3600) / 60);
      const sec = time % 60;
      return `${hour}h:${min}m:${sec}s`;
    };

    // 倒计时
    const countDownNumber = () => {
      if (diffTime <= 0) {
        setCurrentTime(0);
        clearTimeout(timer);
        return;
      }
      // eslint-disable-next-line no-param-reassign
      diffTime--;
      setCurrentTime(diffTime);
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

    React.useEffect(() => {
      if (
        (itemData?.building?._id && !itemData.isqueue) ||
        itemData?.buildings_id
      ) {
        init();
      }
    }, [itemData, init]);

    React.useEffect(() => {
      if (!itemData?.iscreate || itemData?.isqueue) {
        setState({ ...state, upgrade: {}, upgradesVisible: false });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [itemData]);

    console.log(arms);
    return (
      <Container>
        {itemData?._id && (
          <>
            <CardContent>
              <Flex alignItems='flex-start'>
                <GameThing
                  src={currentAttributes?.picture}
                  level={currentAttributes?.propterty?.levelEnergy}
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
                        {currentAttributes?.propterty?.name_cn ||
                          itemData?.propterty?.name_cn}
                      </Text>
                      <Text ml='27px' small>
                        {`${
                          currentAttributes?.propterty?.size.area_x ||
                          itemData?.propterty?.size.area_x
                        }x${
                          currentAttributes?.propterty?.size.area_y ||
                          itemData?.propterty?.size.area_y
                        }`}
                      </Text>
                    </Flex>
                    {!itemData.iscreate &&
                      !itemData?.building?._id &&
                      !itemData?.work_queue_id && (
                        <Text bold small shadow='primary'>
                          {t('NotYetBuilt')}
                        </Text>
                      )}

                    {itemData?.work_queue_id && itemData?.work_add_time && (
                      <Text bold small shadow='primary'>
                        {t('DuringUpgrade')}
                      </Text>
                    )}

                    {(itemData?.building?._id ||
                      state.upgrade?.building_detail?._id) &&
                      state.upgrade?.estimate_building_detail &&
                      !itemData?.work_queue_id && (
                        <Text shadow='primary' bold fontSize='22px'>
                          {t('LevelPreview', {
                            level:
                              state.upgrade?.estimate_building_detail?.propterty
                                ?.levelEnergy,
                          })}
                        </Text>
                      )}
                  </Flex>
                  <Flex flex={1} justifyContent='space-between' flexWrap='wrap'>
                    <ItemInfo>
                      <BuildingValue
                        itemData={itemData}
                        planet_id={planet_id}
                        title={t('planetDurability')}
                        value={`${currentAttributes?.propterty?.now_durability}/${currentAttributes?.propterty?.max_durability}`}
                        addedValue={
                          state.upgrade?.estimate_building_detail
                            ?.max_durability -
                          currentAttributes?.propterty?.max_durability
                        }
                        icon='/images/commons/star/durability.png'
                        isRepair={
                          currentAttributes?.propterty?.now_durability <
                          currentAttributes?.propterty?.max_durability
                        }
                      />
                    </ItemInfo>
                    {/* 矿石建筑 */}
                    {BuildingDetailType.BuildingDetailTypeStone ===
                      currentAttributes?.detail_type && (
                      <ItemInfo>
                        <BuildingValue
                          itemData={itemData}
                          planet_id={planet_id}
                          title={t('Ore Capacity')}
                          value={`${formatDisplayApr(
                            new BigNumber(
                              currentAttributes?.stone?.product?.per_sec_ouput_stone,
                            ).toNumber(),
                          )}/s`}
                          icon='/images/commons/icon/icon_minera.png'
                        />
                      </ItemInfo>
                    )}
                    {/* 生产能量 */}
                    {BuildingDetailType.BuildingDetailTypeEnergy ===
                      currentAttributes?.detail_type && (
                      <ItemInfo>
                        <BuildingValue
                          itemData={itemData}
                          planet_id={planet_id}
                          title={t('Energy Capacity')}
                          value={`${currentAttributes?.energy?.product?.per_sec_ouput_energy}/s`}
                          icon='/images/commons/icon/icon_energy.png'
                        />
                      </ItemInfo>
                    )}
                    {/* 生产香料 */}
                    {BuildingDetailType.BuildingDetailTypePopulation ===
                      currentAttributes?.detail_type && (
                      <ItemInfo>
                        <BuildingValue
                          itemData={itemData}
                          planet_id={planet_id}
                          title={t('Population Capacity')}
                          value={`${currentAttributes?.population?.product?.per_sec_ouput_population}/s`}
                          icon='/images/commons/icon/icon_spice.png'
                        />
                      </ItemInfo>
                    )}
                    <ItemInfo>
                      <BuildingValue
                        itemData={itemData}
                        planet_id={planet_id}
                        title={t('planetOreConsumption')}
                        value={`${formatDisplayApr(
                          new BigNumber(
                            currentAttributes?.propterty?.per_cost_stone,
                          ).toNumber(),
                        )}/s`}
                        addedValue={
                          state.upgrade?.estimate_building_detail?.propterty
                            ?.per_cost_stone -
                          currentAttributes?.propterty?.per_cost_stone
                        }
                        icon='/images/commons/icon/icon_minera.png'
                      />
                    </ItemInfo>
                    <ItemInfo bottomMargin>
                      <BuildingValue
                        itemData={itemData}
                        planet_id={planet_id}
                        title={t('planetEnergyConsumption')}
                        value={`${formatDisplayApr(
                          new BigNumber(
                            currentAttributes?.propterty?.per_cost_energy,
                          ).toNumber(),
                        )}/s`}
                        addedValue={
                          state.upgrade?.estimate_building_detail?.propterty
                            ?.per_cost_energy -
                          currentAttributes?.propterty?.per_cost_energy
                        }
                        icon='/images/commons/icon/icon_energy.png'
                      />
                    </ItemInfo>
                    <ItemInfo bottomMargin>
                      <BuildingValue
                        itemData={itemData}
                        planet_id={planet_id}
                        title={t('planetPopulationConsumption')}
                        value={`${formatDisplayApr(
                          new BigNumber(
                            currentAttributes?.propterty?.per_cost_population,
                          ).toNumber(),
                        )}/s`}
                        addedValue={
                          state.upgrade?.estimate_building_detail?.propterty
                            ?.per_cost_population -
                          currentAttributes?.propterty?.per_cost_population
                        }
                        icon='/images/commons/icon/icon_spice.png'
                      />
                    </ItemInfo>
                  </Flex>
                  {arms.length > 0 && (
                    <Flex
                      flex={1}
                      justifyContent='space-between'
                      flexWrap='wrap'
                    >
                      <Text mt='10px' small>
                        兵种：
                      </Text>
                      {(arms ?? []).map(row => (
                        <Text key={row.unique_id} fontSize='16px' mt='10px'>
                          {row?.game_base_unit?.tag}
                        </Text>
                      ))}
                    </Flex>
                  )}
                  {itemData.detail_type ===
                    BuildingDetailType.BuildingDetailTypeStore && (
                    <Box>
                      <Text color='textSubtle' small mt='5px'>
                        {t('planetResourcesProducedPlanetaryBuildings')}
                      </Text>
                    </Box>
                  )}
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
              {itemData?.work_queue_id && !itemData?.isqueue && (
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
                        Lv {currentAttributes?.propterty?.levelEnergy}
                      </Text>
                      <Box width='47px' height='40px' margin='0 40px'>
                        <Image
                          src='/images/commons/icon/icon-upgrade.png'
                          width={47}
                          height={40}
                        />
                      </Box>
                      <Text shadow='primary' bold fontSize='34px'>
                        Lv {currentAttributes?.propterty?.levelEnergy + 1}
                      </Text>
                    </Flex>
                    <Progress
                      color='progressGreenBar'
                      variant='round'
                      scale='md'
                      linear
                      primaryStep={
                        itemData?.work_status === 3
                          ? 0
                          : Math.round(
                              ((progressTime - currentTime) / progressTime) *
                                10000,
                            ) / 100
                      }
                    />
                    <Text mt='17px' fontSize='17px'>
                      {t('TimeLeft', {
                        time: formatTime(
                          currentTime <= 0 ? progressTime : currentTime,
                        ),
                      })}
                    </Text>
                  </Flex>
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
                    {state.upgrade?.estimate_building_detail ? (
                      <Flex alignItems='center' mb='5px'>
                        <Text shadow='primary' bold fontSize='34px'>
                          Lv{' '}
                          {
                            state.upgrade?.building_detail?.propterty
                              ?.levelEnergy
                          }
                        </Text>
                        {state.upgrade?.estimate_building_detail && (
                          <>
                            <Box width='47px' height='40px' margin='0 40px'>
                              <Image
                                src='/images/commons/icon/icon-upgrade.png'
                                width={47}
                                height={40}
                              />
                            </Box>
                            <Text shadow='primary' bold fontSize='34px'>
                              Lv{' '}
                              {state.upgrade?.building_detail?.propterty
                                ?.levelEnergy + 1}
                            </Text>
                          </>
                        )}
                      </Flex>
                    ) : (
                      <Text color='warning'>
                        {t('Raised to the highest level')}
                      </Text>
                    )}

                    {state.upgrade?.estimate_building_detail && (
                      <Text fontSize='17px'>
                        {t('TimeConsumingUpgrade', {
                          time: formatTime(upgrade_need?.upgrade_time),
                        })}
                      </Text>
                    )}

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
                      disabled={
                        !state.upgrade?.estimate_building_detail?._id ||
                        (upgrade_need?.upgrade_energy > 0 &&
                          planetAssets?.energy <
                            upgrade_need?.upgrade_energy) ||
                        (upgrade_need?.upgrade_population > 0 &&
                          planetAssets?.population <
                            upgrade_need?.upgrade_population) ||
                        (upgrade_need?.upgrade_stone > 0 &&
                          planetAssets?.stone < upgrade_need?.upgrade_stone) ||
                        planet.level <=
                          currentAttributes?.propterty?.levelEnergy
                      }
                      onClick={() =>
                        setState({ ...state, upgradesVisible: true })
                      }
                    >
                      {t('planetBuildingUpgrades')}
                    </ActionButton>

                    <ActionButton
                      disabled={itemData?.isactive}
                      variant='danger'
                      onClick={() => {
                        if (
                          storage.length <= 1 &&
                          itemData?.detail_type ===
                            BuildingDetailType.BuildingDetailTypeStore
                        ) {
                          toastError(
                            t(
                              'Storage jars cannot be destroyed when they are unique',
                            ),
                          );
                        }

                        if (
                          storage.length <= cellar.length &&
                          itemData?.detail_type ===
                            BuildingDetailType.BuildingDetailTypeStore
                        ) {
                          toastError(
                            t(
                              'The number of cellars must be less than or equal to storage tanks',
                            ),
                          );
                          return;
                        }

                        dispatch(storeAction.destoryBuildingVisibleModal(true));
                      }}
                    >
                      {t('planetDestroyBuilding')}
                    </ActionButton>
                  </Flex>
                </Flex>
              )}

              {/* 未创建取消星球&&队列取消星球 */}
              {itemData?.isqueue && (
                <Flex
                  alignItems='center'
                  justifyContent='flex-end'
                  flex={1}
                  style={{ height: '100%' }}
                >
                  <ActionButton
                    variant='danger'
                    onClick={() => onCancelQueue(itemData)}
                  >
                    {t('Cancel')}
                  </ActionButton>
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
          onChange={async () => {
            const level =
              state.upgrade?.building_detail?.propterty?.levelEnergy + 2;
            const buildingsId = itemData?.work_queue_id
              ? itemData?.buildings_id
              : building_id;
            const res: any = await upgrade(planet_id, buildingsId, level);
            setState({ ...state, upgrade: res, upgradesVisible: false });
            onUpgradeLevel(state.upgrade?.building_detail);
          }}
          onClose={() => setState({ ...state, upgradesVisible: false })}
        />

        {/* 取消建筑升级&&建造 */}
        {/* <CancelModal
          visible={cancelVisible}
          title={t('CancelUpgrade')}
          content='将停止当前建筑的队列任务，并且无法收回已支出资源。
是否取消当前建筑任务？'
          onClose={() => setCancelVisible(false)}
          onComplete={cancelBuildingQueue}
        /> */}
      </Container>
    );
  },
);
