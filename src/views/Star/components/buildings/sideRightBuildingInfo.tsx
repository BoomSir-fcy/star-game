import classNames from 'classnames';
import React from 'react';
import styled from 'styled-components';
import { Flex, Box, Button, Image, Text, MarkText } from 'uikit';
import { useStore } from 'state';
import { useTranslation } from 'contexts/Localization';
import { BuildingDetailType } from 'state/types';
import { BuildingValue, GameThing } from '../gameModel';

import { useBuildingUpgrade, useBuildingOperate } from '../gameModel/hooks';
import { BuildingUpgrade } from './buildingUpgrade';
import { BuildingCapacity } from './buildingCapacity';
import { BuildingResources } from './buildingResources';
import { BuildingArms } from './buildingArms';
import { BuildingBuff } from './buildingBuff';

const Container = styled(Box)`
  position: fixed;
  top: 0;
  right: 0;
  z-index: 999;
`;

const SideButton = styled(Box)`
  position: absolute;
  right: -15px;
  top: 0;
  z-index: 8;
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
const Content = styled(Box)`
  position: absolute;
  right: -12px;
  top: 0;
  width: 547px;
  min-height: 100vh;
  background: linear-gradient(270deg, #162d37, #0b1c22, #0a161b);
  border: 2px solid #4ffffb;
  opacity: 0;
  z-index: 5;
  transition: all ease;
  &.active {
    opacity: 1;
    animation: bounceInRight 1s cubic-bezier(0.215, 0.61, 0.355, 1) 0s 1
      alternate forwards;
  }
  &.removeActive {
    animation: bounceInLeft 1s cubic-bezier(0.215, 0.61, 0.355, 1) 0s 1
      alternate forwards;
  }
  @keyframes bounceInRight {
    0% {
      transform: translate3d(200px, 0, 0);
    }
    100% {
      transform: translate3d(0, 0, 0);
    }
  }
  @keyframes bounceInLeft {
    0% {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
    100% {
      opacity: 0;
      transform: translate3d(550px, 0, 0);
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
  planet_id: number;
  buildingsId: string;
  itemData?: Api.Building.BuildingDetail;
}> = ({ planet_id, buildingsId, itemData }) => {
  const { t } = useTranslation();
  const { upgrade } = useBuildingUpgrade();
  const { destory } = useBuildingOperate();

  const balance = useStore(p => p.userInfo.userBalance);
  const [state, setState] = React.useState({
    visible: false,
  });
  const [upgradeInfo, setUpgradeInfo] = React.useState<any>({
    building_detail: {
      petri_dish: {
        arms: [],
      },
    },
    estimate_building_detail: {},
  });
  const currentAttributes = upgradeInfo?.building_detail || itemData;
  const estimate = upgradeInfo?.estimate_building_detail || {};

  const init = React.useCallback(
    async (target_level?: number) => {
      try {
        const res = await upgrade(planet_id, buildingsId, target_level);
        setUpgradeInfo(res);
      } catch (error) {
        console.log('error: ', error);
      }
    },
    [planet_id, buildingsId, upgrade],
  );

  React.useEffect(() => {
    init();
  }, [init]);

  return (
    <Container>
      <SideButton>
        {!state.visible && (
          <Button
            variant='text'
            onClick={() => setState({ ...state, visible: !state.visible })}
          >
            展开
          </Button>
        )}
      </SideButton>
      <Content
        className={classNames(state.visible ? 'active' : 'removeActive')}
      >
        <SideCloseButton
          variant='text'
          onClick={() => setState({ ...state, visible: false })}
        >
          <Box width='34px' height='42px'>
            <Image
              src='../images/commons/icon/icon-back.png'
              width={34}
              height={42}
            />
          </Box>
        </SideCloseButton>
        <Box padding='23px'>
          <Flex mb='20px' alignItems='flex-start'>
            <GameThing
              src={currentAttributes?.picture}
              level={currentAttributes?.propterty?.levelEnergy}
              scale='md'
              border
            />
            <Flex
              flex={1}
              justifyContent='space-between'
              alignItems='flex-start'
            >
              <Flex flexDirection='column' ml='19px' flex={1}>
                <MarkText bold fontSize='18px' fontStyle='normal' mb='15px'>
                  {currentAttributes?.propterty?.name_cn}
                </MarkText>
                {currentAttributes.detail_type ===
                  BuildingDetailType.BuildingDetailTypeStore && (
                  <Text color='textSubtle'>
                    {t('planetResourcesProducedPlanetaryBuildings')}
                  </Text>
                )}
              </Flex>
              <Destory variant='text'>
                <Image
                  src='../images/commons/icon/icon-destory.png'
                  width={30}
                  height={30}
                />
              </Destory>
            </Flex>
          </Flex>
          <Box mb='20px'>
            <MarkText bold fontSize='18px' fontStyle='normal' mb='15px'>
              基本属性
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
                />
              </InfoCard>
              <InfoCard>
                <BuildingValue
                  itemData={itemData}
                  planet_id={planet_id}
                  title={t('吞噬价值')}
                  value={currentAttributes?.exp}
                  icon='/images/commons/star/attackValue.png'
                />
              </InfoCard>
            </Flex>
          </Box>

          {currentAttributes.detail_type ===
            BuildingDetailType.BuildingDetailTypeStore && (
            <BuildingResources
              currnet_building={currentAttributes}
              estimate={estimate}
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

        <BuildingUpgrade currnet_building={currentAttributes} />
      </Content>
    </Container>
  );
};
