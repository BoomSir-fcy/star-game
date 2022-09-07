import React from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { Flex, Box, Button, Image, Text, MarkText } from 'uikit';
import { useStore, storeAction } from 'state';
import { useTranslation } from 'contexts/Localization';
import { BuildingDetailType } from 'state/types';
import { getBuilderSpriteRes } from 'building/core/utils';
import { useDispatch } from 'react-redux';
import {
  fetchUserBalanceAsync,
  fetchUserProductAsync,
} from 'state/userInfo/reducer';
import { BuildRaceData } from 'config/buildConfig';
import { BuildingValue, GameThing } from '../gameModel';
import { useBuildingUpgrade } from '../gameModel/hooks';
import { BuildingUpgrade } from './buildingUpgrade';
import { BuildingCapacity } from './buildingCapacity';
import { BuildingResources } from './buildingResources';
import { BuildingArms } from './buildingArms';
import { BuildingBuff } from './buildingBuff';
import { BuildingConsume } from './buildingConsume';

const Container = styled(Box)`
  position: absolute;
  right: -10px;
  top: -25px;
  height: 950px;
  z-index: 199;
`;
const SideCloseButton = styled(Button)`
  position: absolute;
  right: 542px;
  top: calc(50% - 87px);
  width: 43px;
  height: 173px;
  z-index: 15;
  padding: 0;
  background-image: url('../images/commons/sideCloseButton.png');
  &:active {
    transform: rotate(0deg) !important;
  }
`;
const Content = styled(Box)<{ animation?: boolean }>`
  position: relative;
  width: 547px;
  height: 100%;
  background: linear-gradient(270deg, #162d37, #0b1c22, #0a161b);
  border: 2px solid #4ffffb;
  opacity: 0;
  transition: all 0.5s ease;
  padding-bottom: 0;
  &.active {
    opacity: 1;
    animation: ${({ animation }) =>
      animation &&
      'bounceInRight 0.5s cubic-bezier(0.215, 0.61, 0.355, 1) 0s 1 alternate forwards'};
  }
  &.removeActive {
    opacity: 0;
  }
  @keyframes bounceInRight {
    0% {
      transform: translate(200px, 0);
    }
    100% {
      transform: translate(0, 0);
    }
  }
`;
const InfoCard = styled(Flex)`
  width: 50%;
`;

const Destory = styled(Button)`
  width: 30px;
  height: 30px;
  padding: 0;
`;

export const SideRightBuildingInfo: React.FC<{
  planet: Api.Planet.PlanetInfo;
  planet_id: number;
  buildingsId: string;
  visible: boolean;
  itemData?: any;
  workQueue: any[];
  animation?: boolean;
  onCreateBuilding: (building: Api.Building.Building) => void;
  onClose: (destory?: boolean) => void;
  OnAddBuildings: (data) => void;
}> = ({
  visible,
  planet,
  planet_id,
  buildingsId,
  itemData,
  workQueue,
  animation,
  onCreateBuilding,
  onClose,
  OnAddBuildings,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { upgrade } = useBuildingUpgrade();
  const [upgradeInfo, setUpgradeInfo] = React.useState<any>({
    building_detail: {
      petri_dish: {
        arms: [],
      },
    },
    estimate_building_detail: {},
  });
  const [NowLevel, setNowLevel] = React.useState(0);

  const isInQueue = React.useMemo(() => {
    if (workQueue.length > 0) {
      const taregtBuildings = workQueue.filter(
        ({ _id, buildings_id, work_type }) =>
          (_id === itemData?._id || buildings_id === itemData?._id) &&
          work_type === 2,
      );
      if (taregtBuildings.length) {
        setNowLevel(taregtBuildings[0].target_level);
        return true;
      }
      return false;
    }
    return false;
  }, [workQueue, itemData]);

  const estimate = upgradeInfo?.estimate_building_detail || {};
  const currentAttributes = React.useMemo(() => {
    return upgradeInfo?.building_detail?._id
      ? {
          ...upgradeInfo?.building_detail,
          isbuilding: itemData?.isbuilding,
          _id: itemData?._id,
        }
      : itemData;
  }, [upgradeInfo, itemData]);

  const init = React.useCallback(
    async (target_level?: number) => {
      // 获取当前建筑的最高等级
      let selfLevel = '';
      // 已经创建建筑加入队列，获取加入队列的最高建筑信息
      if (workQueue.length > 0) {
        const taregtBuildings = workQueue.filter(
          ({ _id, buildings_id, work_type }) =>
            (_id === itemData?._id || buildings_id === itemData?._id) &&
            work_type === 2,
        );
        const taregtBuildingLevel = taregtBuildings?.sort(
          (a, b) =>
            b?.propterty?.levelEnergy - a?.propterty?.levelEnergy ||
            b?.target_level - a?.target_level,
        );
        if (taregtBuildingLevel.length > 0) {
          selfLevel =
            taregtBuildingLevel[0]?.propterty?.levelEnergy + 2 ||
            taregtBuildingLevel[0]?.target_level + 1;
        }
      }

      try {
        const res = await upgrade(
          planet_id,
          buildingsId,
          target_level || selfLevel,
        );
        setUpgradeInfo(res);
      } catch (error) {
        console.log('error: ', error);
      }
    },
    [workQueue, itemData?._id, upgrade, planet_id, buildingsId],
  );

  const getBuildings = React.useCallback(() => {
    const build =
      BuildRaceData[currentAttributes?.race][currentAttributes?.index];
    return build;
  }, [currentAttributes]);

  React.useEffect(() => {
    if (itemData?.isbuilding) {
      init();
    } else {
      setUpgradeInfo({
        building_detail: {
          petri_dish: {
            arms: [],
          },
        },
        estimate_building_detail: {
          _id: itemData?._id,
        },
      });
    }
  }, [init, itemData]);

  return (
    <Container>
      <Content
        animation={animation}
        className={classNames(visible ? 'active' : 'removeActive')}
      >
        <SideCloseButton
          variant='text'
          className='guide_step_4'
          onClick={() => onClose()}
        >
          <Box width='34px' height='42px'>
            <Image
              src='../images/commons/icon/icon-back.png'
              width={34}
              height={42}
            />
          </Box>
        </SideCloseButton>
        <Flex
          flexDirection='column'
          style={{
            height: 'calc(100%)',
            overflow: 'visible auto',
          }}
        >
          <Box padding='20px'>
            <Flex mb='15px' alignItems='flex-start'>
              <GameThing
                src={getBuilderSpriteRes(
                  currentAttributes.race,
                  `${currentAttributes.index}`,
                )}
                level={
                  estimate?._id
                    ? isInQueue && currentAttributes?.propterty?.levelEnergy > 1
                      ? NowLevel - 1
                      : currentAttributes?.propterty?.levelEnergy
                    : 'MAX'
                }
                scale='sm'
                border
              />
              <Flex
                flex={1}
                justifyContent='space-between'
                alignItems='flex-start'
              >
                <Flex flexDirection='column' ml='19px' flex={1}>
                  <Flex alignItems='flex-end' mb='15px'>
                    <MarkText mr='20px' bold fontSize='18px' fontStyle='normal'>
                      {t(
                        getBuildings()?.name ||
                          currentAttributes?.propterty?.name_cn,
                      )}
                    </MarkText>
                    <Text>
                      {t('Grid')} :&nbsp;
                      {currentAttributes?.propterty?.size?.area_x}&nbsp;x&nbsp;
                      {currentAttributes?.propterty?.size?.area_y}
                    </Text>
                  </Flex>
                  <Text color='textSubtle'>{t(getBuildings()?.desc)}</Text>
                </Flex>
                {!currentAttributes?.isqueue && (
                  <Destory
                    variant='text'
                    onClick={event => {
                      event.stopPropagation();
                      event.preventDefault();
                      dispatch(
                        storeAction.destoryBuildingModal({
                          visible: true,
                          destory: {
                            ...currentAttributes,
                            describe: t(getBuildings()?.desc),
                          },
                        }),
                      );
                    }}
                  >
                    <Image
                      src='../images/commons/icon/icon-destory.png'
                      width={30}
                      height={30}
                    />
                  </Destory>
                )}
              </Flex>
            </Flex>
            <Box mb='15px'>
              <MarkText bold fontSize='18px' fontStyle='normal' mb='15px'>
                {t('Basic properties')}
              </MarkText>
              <Flex justifyContent='space-between' width='100%'>
                <InfoCard>
                  <BuildingValue
                    itemData={itemData}
                    planet_id={planet_id}
                    title={t('planetDurability')}
                    value={`${
                      currentAttributes?.propterty?.now_durability || 0
                    }/${currentAttributes?.propterty?.max_durability || 0}`}
                    icon='/images/commons/star/durability.png'
                    isRepair={
                      currentAttributes?.propterty?.now_durability <
                      currentAttributes?.propterty?.max_durability
                    }
                    onClose={onClose}
                  />
                </InfoCard>
                <InfoCard>
                  <BuildingValue
                    itemData={itemData}
                    planet_id={planet_id}
                    title={t('devour value')}
                    value={currentAttributes?.exp}
                    icon='/images/commons/star/attackValue.png'
                  />
                </InfoCard>
              </Flex>
            </Box>

            <BuildingConsume currnet_building={currentAttributes} />

            {(currentAttributes.detail_type ===
              BuildingDetailType.BuildingDetailTypeStore ||
              currentAttributes.detail_type ===
                BuildingDetailType.BuildingDetailTypeCellar) && (
              <BuildingResources
                planet_id={planet_id}
                currnet_building={currentAttributes}
                estimate={estimate}
                onClose={() => {
                  onClose();
                  dispatch(fetchUserBalanceAsync());
                  dispatch(fetchUserProductAsync());
                }}
              />
            )}

            {currentAttributes.detail_type ===
              BuildingDetailType.BuildingDetailTypeAk && (
              <BuildingBuff currnet_building={currentAttributes} />
            )}

            {(currentAttributes.detail_type ===
              BuildingDetailType.BuildingDetailTypeStone ||
              currentAttributes.detail_type ===
                BuildingDetailType.BuildingDetailTypeEnergy ||
              currentAttributes.detail_type ===
                BuildingDetailType.BuildingDetailTypePopulation) && (
              <BuildingCapacity currnet_building={currentAttributes} />
            )}

            {(currentAttributes.detail_type ===
              BuildingDetailType.BuildingDetailTypeFactory1 ||
              currentAttributes.detail_type ===
                BuildingDetailType.BuildingDetailTypeFactory2 ||
              currentAttributes.detail_type ===
                BuildingDetailType.BuildingDetailTypeFactory3) && (
              <BuildingArms currnet_building={currentAttributes} />
            )}
          </Box>

          {Boolean(estimate?._id) && (
            <BuildingUpgrade
              planet={planet}
              currnet_building={currentAttributes}
              estimate={estimate}
              onFinish={onClose}
              onCreateBuilding={onCreateBuilding}
              OnAddBuildings={() => OnAddBuildings(itemData)}
            />
          )}
        </Flex>
      </Content>
    </Container>
  );
};
