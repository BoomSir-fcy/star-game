import React, { useMemo } from 'react';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import { useDispatch } from 'react-redux';
import { useStore, storeAction } from 'state';
import { Flex, Box, GraphicsCard, Button, MarkText, Text, Image } from 'uikit';

import { useTranslation } from 'contexts/Localization';
import { useToast } from 'contexts/ToastsContext';
import { formatDisplayApr } from 'utils/formatBalance';

const Container = styled(GraphicsCard)`
  position: relative;
  /* height: 180px; */
  /* overflow: hidden scroll; */
  padding: 25px 20px 40px;
  border: 0;
  border-top: 2px solid #4ffffb;
  flex: 1;
  height: max-content;
`;
const Content = styled(Box)`
  position: relative;
  z-index: 2;
`;
const Items = styled(Flex)`
  width: 48%;
  justify-content: space-between;
`;

const ButtonItem = styled(Button)`
  /* &:disabled {
    opacity: 0.5;
  } */
`;

export const BuildingUpgrade: React.FC<{
  planet: Api.Planet.PlanetInfo;
  currnet_building: Api.Building.Building;
  estimate: Api.Building.BuildingDetail;
  onCreateBuilding: (building: Api.Building.Building) => void;
  onFinish: () => void;
  OnAddBuildings: () => void;
}> = ({
  planet,
  currnet_building,
  estimate,
  onCreateBuilding,
  onFinish,
  OnAddBuildings,
}) => {
  const { t } = useTranslation();
  const { toastError } = useToast();
  const dispatch = useDispatch();
  const planetAssets = useStore(p => p.buildling.planetAssets);
  const balanceList = useStore(p => p.userInfo.userBalance);

  const formatTime = (time: number) => {
    const hour = Math.floor(time / 3600);
    const min = Math.floor((time % 3600) / 60);
    const sec = time % 60;
    return `${hour}h:${min}m:${sec}s`;
  };

  const TokenBlance = React.useCallback(
    (Token: string) => {
      const balance = balanceList.filter(item => {
        return item.symbol === Token;
      });
      return balance[0];
    },
    [balanceList],
  );

  const ShowWarText = useMemo(() => {
    return (
      planetAssets?.energy <
        (currnet_building?.upgrade_need?.upgrade_energy ||
          currnet_building?.upgrade_need?.upgrade_energy) ||
      planetAssets?.stone <
        (currnet_building?.upgrade_need?.upgrade_stone ||
          currnet_building?.upgrade_need?.upgrade_stone) ||
      planetAssets?.population <
        (currnet_building?.upgrade_need?.upgrade_population ||
          currnet_building?.upgrade_need?.upgrade_population) ||
      TokenBlance('BOX')?.amount <
        (currnet_building?.upgrade_need?.upgrade_box ||
          currnet_building?.upgrade_need?.upgrade_box) ||
      currnet_building?.propterty?.levelEnergy + 1 > planet.level
    );
  }, [currnet_building, planetAssets, TokenBlance, planet]);

  return (
    <Container stripe>
      <Content>
        {!currnet_building?.isPreview ? (
          <>
            <Flex
              width='100%'
              justifyContent='space-between'
              alignItems='center'
            >
              <Flex alignItems='center'>
                <MarkText bold fontSize='18px' fontStyle='normal'>
                  {currnet_building?.isbuilding
                    ? t('upgradeRequirements')
                    : t('construction needs')}
                </MarkText>
                {currnet_building?.isbuilding && (
                  <Flex alignItems='center' ml='30px' mt='4px'>
                    <Text shadow='primary' bold small>
                      Lv {currnet_building?.propterty?.levelEnergy}
                    </Text>
                    <>
                      <Box width='21px' height='17px' margin='0 5px'>
                        <Image
                          src='/images/commons/icon/icon-upgrade.png'
                          width={47}
                          height={40}
                        />
                      </Box>
                      <Text shadow='primary' bold small>
                        Lv {currnet_building?.propterty?.levelEnergy + 1}
                      </Text>
                    </>
                  </Flex>
                )}
              </Flex>
              <Text textAlign='right' style={{ flex: 1 }}>
                {t('TimeCnsumingBuild', {
                  time: formatTime(
                    currnet_building?.upgrade_need?.upgrade_time,
                  ),
                })}
              </Text>
            </Flex>
            <Flex width='100%' mt='20px' flexDirection='column'>
              <Flex
                alignItems='center'
                justifyContent='space-between'
                width='100%'
                mb='13px'
              >
                <Items alignItems='center'>
                  <Text ellipsis>{t('EnergyRequiredBuild')}</Text>
                  <Flex flex={1} justifyContent='flex-end' ml='2px'>
                    <Text
                      small
                      color={`${
                        planetAssets?.energy <
                        (currnet_building?.upgrade_need?.upgrade_energy ||
                          currnet_building?.upgrade_need?.upgrade_energy)
                          ? 'warning'
                          : 'progressGreenBar'
                      }`}
                    >
                      {formatDisplayApr(
                        new BigNumber(
                          currnet_building?.upgrade_need?.upgrade_energy ||
                            currnet_building?.upgrade_need?.upgrade_energy,
                        ).toNumber(),
                      )}
                    </Text>
                    <Text small>
                      /
                      {formatDisplayApr(
                        new BigNumber(planetAssets?.energy).toNumber(),
                      )}
                    </Text>
                  </Flex>
                </Items>
                <Items alignItems='center'>
                  <Text ellipsis>{t('OreRequiredConstruction')}</Text>
                  <Flex flex={1} justifyContent='flex-end' ml='2px'>
                    <Text
                      small
                      color={`${
                        planetAssets?.stone <
                        (currnet_building?.upgrade_need?.upgrade_stone ||
                          currnet_building?.upgrade_need?.upgrade_stone)
                          ? 'warning'
                          : 'progressGreenBar'
                      }`}
                    >
                      {formatDisplayApr(
                        new BigNumber(
                          currnet_building?.upgrade_need?.upgrade_stone ||
                            currnet_building?.upgrade_need?.upgrade_stone,
                        ).toNumber(),
                      )}
                    </Text>
                    <Text small>
                      /
                      {formatDisplayApr(
                        new BigNumber(planetAssets?.stone).toNumber(),
                      )}
                    </Text>
                  </Flex>
                </Items>
              </Flex>

              <Flex
                mb='13px'
                alignItems='center'
                justifyContent='space-between'
                width='100%'
              >
                <Items alignItems='center'>
                  <Text ellipsis>{t('SpicesNeededToBuild')}</Text>
                  <Flex flex={1} justifyContent='flex-end' ml='2px'>
                    <Text
                      small
                      color={`${
                        planetAssets?.population <
                        (currnet_building?.upgrade_need?.upgrade_population ||
                          currnet_building?.upgrade_need?.upgrade_population)
                          ? 'warning'
                          : 'progressGreenBar'
                      }`}
                    >
                      {formatDisplayApr(
                        new BigNumber(
                          currnet_building?.upgrade_need?.upgrade_population ||
                            currnet_building?.upgrade_need?.upgrade_population,
                        ).toNumber(),
                      )}
                    </Text>
                    <Text small>
                      /
                      {formatDisplayApr(
                        new BigNumber(planetAssets?.population).toNumber(),
                      )}
                    </Text>
                  </Flex>
                </Items>
                <Items alignItems='center' justifyContent='flex-end'>
                  <Text ellipsis>{t('BuildRequiredBOX')}</Text>
                  <Flex flex={1} justifyContent='flex-end' ml='2px'>
                    <Text
                      ml='2px'
                      small
                      color={`${
                        TokenBlance('BOX')?.amount <
                        (currnet_building?.upgrade_need?.upgrade_box ||
                          currnet_building?.upgrade_need?.upgrade_box)
                          ? 'warning'
                          : 'progressGreenBar'
                      }`}
                    >
                      {formatDisplayApr(
                        new BigNumber(
                          currnet_building?.upgrade_need?.upgrade_box ||
                            currnet_building?.upgrade_need?.upgrade_box,
                        ).toNumber(),
                      )}
                    </Text>
                    <Text small>
                      /
                      {formatDisplayApr(
                        new BigNumber(TokenBlance('BOX')?.amount).toNumber(),
                      )}
                    </Text>
                  </Flex>
                </Items>
              </Flex>
              <Flex
                alignItems='center'
                justifyContent='space-between'
                width='100%'
              >
                <Items alignItems='center' justifyContent='flex-end'>
                  <Text ellipsis>{t('Planet Level')}</Text>
                  <Flex flex={1} justifyContent='flex-end' ml='2px'>
                    <Text
                      ml='2px'
                      small
                      color={`${
                        currnet_building?.propterty?.levelEnergy + 1 >
                        planet.level
                          ? 'warning'
                          : 'progressGreenBar'
                      }`}
                    >
                      Lv{currnet_building?.propterty?.levelEnergy + 1}
                    </Text>
                    <Text small>/Lv{planet.level}</Text>
                  </Flex>
                </Items>
              </Flex>
            </Flex>
          </>
        ) : (
          <></>
        )}
        {ShowWarText && (
          <Flex pt='10px' justifyContent='center'>
            <Text fontSize='16px' color='#ec3838'>
              {t(
                'Please go to the Storage Tank to recharge or upgrade the planet',
              )}
            </Text>
          </Flex>
        )}
        {!currnet_building?.isPreview ? (
          <Flex justifyContent='center' mt='10px'>
            {currnet_building?.isbuilding ? (
              <ButtonItem
                width='226px'
                height='53px'
                variant='purple'
                disabled={
                  planet?.level <= currnet_building?.propterty?.levelEnergy
                }
                onClick={() => {
                  if (
                    planet?.level <= currnet_building?.propterty?.levelEnergy
                  ) {
                    toastError(t('Please upgrade the planet level first'));
                    return;
                  }
                  dispatch(
                    storeAction.upgradesBuildingModal({
                      visible: true,
                      upgrad: {
                        building_detail: currnet_building,
                        estimate_building_detail: estimate,
                      },
                    }),
                  );
                  onFinish();
                }}
              >
                <Text bold fontSize='16px' color='#4FFFFB'>
                  {t('planetBuildingUpgrades')}
                </Text>
              </ButtonItem>
            ) : (
              <></>
              // <ButtonItem
              //   width='226px'
              //   height='53px'
              //   variant='purple'
              //   onClick={() => {
              //     onCreateBuilding(currnet_building);
              //   }}
              // >
              //   <Text bold fontSize='16px' color='#4FFFFB'>
              //     {t('build buildings')}
              //   </Text>
              // </ButtonItem>
            )}
          </Flex>
        ) : (
          <Flex justifyContent='center' mt='100px'>
            <ButtonItem
              width='226px'
              height='53px'
              variant='purple'
              onClick={() => {
                OnAddBuildings();
                // 关闭弹窗
                onFinish();
              }}
            >
              <Text bold fontSize='16px' color='#4FFFFB'>
                {t('Add Buildings')}
              </Text>
            </ButtonItem>
          </Flex>
        )}
      </Content>
    </Container>
  );
};
