import React, { useCallback } from 'react';
import styled, { css } from 'styled-components';
import { useDispatch } from 'react-redux';
import { Flex, Box, Card, Text, Image, Button } from 'uikit';
import { useToast } from 'contexts/ToastsContext';
import { useStore, storeAction } from 'state';
import { Api } from 'apis';

import { fetchPlanetBuildingsAsync } from 'state/buildling/fetchers';
import { useTranslation } from 'contexts/Localization';

import { BuildingDetailType } from 'state/types';
import { useBuildingUpgrade, useBuildingOperate } from './hooks';

import { ThingaddBlood, GameThing, ThingRepair } from '..';
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
  height: 138px;
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
    const { destory, upgrade: upgradeBuilding } = useBuildingOperate();
    const selfBuilding = useStore(p => p.buildling?.selfBuildings?.buildings);
    const planetInfo = useStore(p => p.planet.planetInfo[planet_id ?? 0]);
    const planetAssets = useStore(p => p.buildling.planetAssets);
    let timer: any = null;

    const [state, setState] = React.useState({
      destoryVisible: false,
      upgradesVisible: false,
      upgrade: {} as any,
      time: diffTime || 0,
    });
    const itemData =
      selfBuilding?.find((row: any) => row?.building?._id === building_id)
        ?.building || currentBuild;

    const init = useCallback(async () => {
      const res = await upgrade(planet_id, building_id);
      setState({ ...state, upgrade: res });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [upgrade, planet_id, building_id]);

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

    console.log('gameisbuilding', itemData, diffTime);
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
                    <Text bold small shadow='primary'>
                      尚未建筑
                    </Text>
                  </Flex>
                  <Flex flex={1} justifyContent='space-between' flexWrap='wrap'>
                    {/* 矿石建筑 */}
                    {BuildingDetailType.BuildingDetailTypeStone ===
                      itemData?.detail_type && (
                      <ItemInfo>
                        <Box width={50} height={50} mr='5px'>
                          <StyledImage
                            width={50}
                            height={50}
                            src='/images/commons/icon/icon_minera.png'
                          />
                        </Box>
                        <Box>
                          <Flex alignItems='center'>
                            <Text color='textSubtle' small>
                              {t('Ore Capacity')}
                            </Text>
                          </Flex>
                          <Text small>
                            {itemData?.stone?.product?.per_sec_ouput_stone}/s
                          </Text>
                        </Box>
                      </ItemInfo>
                    )}
                    {/* 生产能量 */}
                    {BuildingDetailType.BuildingDetailTypeEnergy ===
                      itemData?.detail_type && (
                      <ItemInfo>
                        <Box width={50} height={50} mr='5px'>
                          <StyledImage
                            width={50}
                            height={50}
                            src='/images/commons/icon/icon_energy.png'
                          />
                        </Box>
                        <Box>
                          <Flex alignItems='center'>
                            <Text color='textSubtle' small>
                              {t('Energy Capacity')}
                            </Text>
                          </Flex>
                          <Text small>
                            {itemData?.stone?.product?.per_sec_ouput_energy}/s
                          </Text>
                        </Box>
                      </ItemInfo>
                    )}
                    {/* 生产香料 */}
                    {BuildingDetailType.BuildingDetailTypePopulation ===
                      itemData?.detail_type && (
                      <ItemInfo>
                        <Box width={50} height={50} mr='5px'>
                          <StyledImage
                            width={50}
                            height={50}
                            src='/images/commons/icon/icon_spice.png'
                          />
                        </Box>
                        <Box>
                          <Flex alignItems='center'>
                            <Text color='textSubtle' small>
                              {t('Population Capacity')}
                            </Text>
                          </Flex>
                          <Text small>
                            {itemData?.stone?.product?.per_sec_ouput_population}
                            /s
                          </Text>
                        </Box>
                      </ItemInfo>
                    )}
                    <ItemInfo>
                      <Box width={50} height={50} mr='5px'>
                        <StyledImage
                          width={50}
                          height={50}
                          src='/images/commons/star/durability.png'
                        />
                      </Box>
                      <Box>
                        <Flex alignItems='center'>
                          <Text color='textSubtle' small>
                            {t('planetDurability')}
                          </Text>
                          {itemData?.propterty?.now_durability !==
                            itemData?.propterty?.max_durability && (
                            <ThingRepair
                              itemData={itemData}
                              planet_id={planet_id}
                              building_id={building_id}
                              onCallback={getSelfBuilding}
                            />
                          )}
                        </Flex>
                        <Text small>
                          {`${itemData?.propterty?.now_durability}/${itemData?.propterty?.max_durability}`}
                        </Text>
                      </Box>
                    </ItemInfo>
                    <ItemInfo bottomMargin>
                      <Box width={50} height={50} mr='5px'>
                        <Image
                          src='/images/commons/icon/icon_energy.png'
                          width={50}
                          height={50}
                        />
                      </Box>
                      <Flex flexDirection='column' justifyContent='center'>
                        <Text color='textTips' small>
                          {t('planetEnergyConsumption')}
                        </Text>
                        <Text small>
                          {itemData?.propterty?.per_cost_energy}/s
                        </Text>
                      </Flex>
                    </ItemInfo>
                    <ItemInfo bottomMargin>
                      <Box width={50} height={50} mr='5px'>
                        <Image
                          src='/images/commons/icon/icon_spice.png'
                          width={50}
                          height={50}
                        />
                      </Box>
                      <Flex flexDirection='column' justifyContent='center'>
                        <Text color='textTips' small>
                          {t('planetPopulationConsumption')}
                        </Text>
                        <Text small>
                          {itemData?.propterty?.per_cost_population}/s
                        </Text>
                      </Flex>
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
              {/* {!itemData?.isbuilding && (
                <>
                  <Flex mt='21px' mb='15px' alignItems='flex-end'>
                    <Text bold fontSize='24px' shadow='primary'>
                      建造要求
                    </Text>
                    <Text ml='16px' fontSize='16px' mb='2px'>
                      建造耗时（{formatTime(state.time)}）
                    </Text>
                  </Flex>
                  <Text fontSize='16px' mb='5px'>
                    建造所需香料：1000/{planetAssets?.population}
                  </Text>
                  <Text fontSize='16px'>
                    建造所需矿石：3000/{planetAssets?.population}
                  </Text>
                </>
              )} */}

              {/* 取消升级、创建建筑 */}
              <Flex>
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

              <Flex
                justifyContent='space-between'
                alignItems='center'
                style={{
                  height: 138,
                }}
              >
                {(itemData?.isactive ||
                  itemData?.propterty?.levelEnergy <
                    state.upgrade?.max_building_level) && (
                  <Flex flexDirection='column'>
                    <Flex alignItems='center'>
                      <Text shadow='primary' fontSize='33px'>
                        Lv {itemData?.propterty?.levelEnergy}
                      </Text>
                      <Box width='47px' height='40px' margin='0 44px'>
                        <Image
                          src='/images/commons/icon/icon-upgrade.png'
                          width={47}
                          height={40}
                        />
                      </Box>
                      <Text shadow='primary' fontSize='34px'>
                        Lv {itemData?.propterty?.levelEnergy + 1}
                      </Text>
                    </Flex>
                    {/* <Text color='textSubtle' small>
                      {t('planetPopulationRequiredUpgrade%value%people', {
                        value: state.upgrade?.cost_population,
                      })}
                    </Text> */}
                    <Text small>升级耗时（5h:50m:15s）</Text>
                    <Text small>
                      升级所需人口：1000/{state.upgrade?.cost_population}人
                    </Text>
                    <Text small>升级所需矿石：900/1000人</Text>
                  </Flex>
                )}
                <Flex flexDirection='column'>
                  {itemData?.propterty?.levelEnergy <
                    state.upgrade?.max_building_level && (
                    <ActionButton
                      disabled={
                        itemData?.propterty?.levelEnergy - planetInfo?.level >=
                          1 || itemData?.isactive
                      }
                      onClick={() =>
                        setState({ ...state, upgradesVisible: true })
                      }
                    >
                      {t('planetBuildingUpgrades')}
                    </ActionButton>
                  )}
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
      </Container>
    );
  },
);
