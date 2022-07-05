import React, { useCallback, useEffect, useMemo, useState } from 'react';
import StarAddBtn from 'components/StarAddBtn';
import ModalWrapper from 'components/Modal';
import StarCom from 'components/StarCom';
import {
  MysteryBoxBaseStyled,
  mysteryBoxQualities,
  MysteryBoxStyled,
  MysteryBoxBoxStyled,
} from 'components/MysteryBoxCom';
import styled from 'styled-components';
import {
  Image,
  Flex,
  Text,
  BgCard,
  Button,
  Card,
  Box,
  Dots,
  StripedProgress,
  GraphicsCard,
} from 'uikit';
import { Api } from 'apis';
import { useStore, storeAction } from 'state';
import { useWeb3React } from '@web3-react/core';
import { ConnectWalletButton, Globe } from 'components';
import { useTranslation } from 'contexts/Localization';
import useParsedQueryString from 'hooks/useParsedQueryString';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setActiveMaterialMap, setUpgradePlanetId } from 'state/planet/actions';
import { useToast } from 'contexts/ToastsContext';
import { Steps, Hints } from 'intro.js-react'; // 引入我们需要的组件
import { useGuide } from 'hooks/useGuide';
import eventBus from 'utils/eventBus';
import { fetchPlanetInfoAsync } from 'state/planet/fetchers';
import { QualityColor } from 'uikit/theme/colors';
import { GradeBox, UpgradeCard, Upgrading } from './components/upgrade';
import { useUpgrade } from './components/upgrade/hooks';

import 'intro.js/introjs.css';
import { UpgradeCost } from './components/upgrade/UpgradeCost';

const MysteryBoxFlexStyled = styled(MysteryBoxStyled)`
  width: 374px;
  height: 500px;
  /* margin-right: 100px;
  margin-left: -40px;
  margin-top: 50px; */
`;

const MysteryBoxBaseNewStyled = styled(MysteryBoxBaseStyled)`
  bottom: -40px;
`;
const MysteryBoxStarStyled = styled(MysteryBoxBoxStyled)`
  background: none;
  top: -40px;
`;

const Upgrade = () => {
  const { toastSuccess, toastError } = useToast();
  const { account } = useWeb3React();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const parsedQs = useParsedQueryString();
  const planetId = Number(parsedQs.id);
  const { guides, setGuide } = useGuide(location.pathname);
  const [isHighestLevel, setIsHighestLevel] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pending, setPending] = useState(false);
  const [upgradeInfo, setUpgradeInfo] = useState<Api.Planet.UpgradePlanetInfo>({
    consume_population: 0,
    consume_star: 0,
    consume_stone: 0,
    consume_energy: 0,
    estimate_max_building_level: 2,
    estimate_planet_info: {} as Api.Planet.PlanetInfo,
    material_planet_num: 5,
    now_max_building_level: 1,
    now_planet_info: {} as Api.Planet.PlanetInfo,
    space_utilization: '0',
    upgrade_time: 0,
    upgrade_exp: 0,
  });

  const [stepsEnabled, setStepsEnabled] = useState(true);
  const steps = useMemo(
    () => [
      {
        element: '.planet_level_head',
        intro: t(
          'Upgrading the planet can build higher-level buildings and improve the basic attributes of the planet.',
        ),
      },
    ],
    [t],
  );

  const { upgrade } = useUpgrade();
  const { activeMaterialMap, upgradePlanetId, planetInfo } = useStore(
    p => p.planet,
  );

  // 升级星球不一致，清空选择的材料星球
  useEffect(() => {
    if (upgradePlanetId !== planetId) {
      dispatch(setUpgradePlanetId(planetId));
      dispatch(setActiveMaterialMap(null));
    }
  }, [upgradePlanetId, planetId, dispatch]);

  // 星球升级信息
  const getStarUpgradeInfo = useCallback(async () => {
    try {
      const [planetUpgradeInfo] = await Promise.all([
        Api.PlanetApi.getPlanetUpgradeInfo(planetId),
      ]);
      if (Api.isSuccess(planetUpgradeInfo)) {
        const {
          estimate_planet_info,
          now_planet_info,
          estimate_max_building_level,
          now_max_building_level,
        } = planetUpgradeInfo.data;
        const isHighest =
          now_planet_info?.max_level &&
          now_planet_info.level === now_planet_info?.max_level;
        setUpgradeInfo({
          ...planetUpgradeInfo.data,
          estimate_planet_info: {
            ...(isHighest ? now_planet_info : estimate_planet_info),
            build_level: estimate_max_building_level,
          },
          now_planet_info: {
            ...now_planet_info,
            build_level: now_max_building_level,
          },
          material_planet_num: 5,
        });
        setIsHighestLevel(isHighest);
      }
    } catch (error) {
      console.error(error);
    }
  }, [planetId]);

  useEffect(() => {
    getStarUpgradeInfo();
  }, [getStarUpgradeInfo]);

  const onRefreshClick = React.useCallback(() => {
    dispatch(fetchPlanetInfoAsync([planetId]));
    getStarUpgradeInfo();
  }, [planetId, getStarUpgradeInfo, dispatch]);

  // 添加事件监听，用于更新状态
  React.useEffect(() => {
    eventBus.addEventListener('onRefresh', onRefreshClick);
    return () => {
      eventBus.removeEventListener('onRefresh', onRefreshClick);
    };
  }, [onRefreshClick]);

  const upInfo = useMemo(() => {
    return {
      now_max_building_level: upgradeInfo.now_max_building_level,
      estimate_max_building_level: upgradeInfo.estimate_max_building_level,
      build_level:
        upgradeInfo.estimate_max_building_level -
        upgradeInfo.now_max_building_level,
    };
  }, [upgradeInfo]);

  // 添加材料星球
  const StarAddBox = useMemo(() => {
    const arr = [];
    const materialKey = Object.keys(activeMaterialMap);
    for (let i = 0; i < upgradeInfo.material_planet_num; i++) {
      const id = Number(materialKey[i]);
      arr.push(
        <StarAddBtn
          key={i}
          showIcon
          url={activeMaterialMap[id]?.picture}
          onRemove={() => {
            dispatch(setActiveMaterialMap({ [id]: null }));
          }}
          callBack={() => {
            navigate(`/upgrade-list?i=${planetId}`);
          }}
        />,
      );
    }
    return arr;
  }, [
    upgradeInfo.material_planet_num,
    planetId,
    activeMaterialMap,
    dispatch,
    navigate,
  ]);

  const usableMaterialIds = useMemo(() => {
    // const materialIds = [] as number[];
    // Object.keys(activeMaterialMap).forEach(key => {
    //   if (activeMaterialMap[Number(key)]) materialIds.push(Number(key));
    // });
    // return materialIds;
    return Object.keys(activeMaterialMap);
  }, [activeMaterialMap]);

  React.useEffect(() => {
    return () => {
      dispatch(storeAction.toggleVisible({ visible: false }));
    };
  }, [dispatch]);

  // 升级经验
  const { expStep, curExp, maxExp, preExpStep, expectedExp } = useMemo(() => {
    const maxValue = Number(upgradeInfo.upgrade_exp);
    const currentValue = planetInfo[planetId]?.exp;
    let rsVal = 0;
    if (!currentValue || currentValue <= 0) {
      rsVal = 0;
    } else if (currentValue && currentValue > maxValue) {
      rsVal = 100;
    } else rsVal = Number((currentValue / maxValue).toFixed(4)) * 100;

    const _expectedExp = Object.values(activeMaterialMap).reduce(
      (prev, item) => {
        return prev + item.can_provided_exp;
      },
      0,
    );
    const _exportExp = currentValue + _expectedExp;
    const _preExpStep =
      Number(
        (_exportExp / maxValue > 1 ? 1 : _exportExp / maxValue).toFixed(4),
      ) * 100;

    return {
      expStep: rsVal,
      preExpStep: _preExpStep,
      curExp: currentValue,
      exportExp: _exportExp,
      expectedExp: _expectedExp,
      maxExp: maxValue,
    };
  }, [upgradeInfo, planetInfo, planetId, activeMaterialMap]);

  const rendeButton = useMemo(() => {
    if (isHighestLevel) {
      return <Text color='warning'>{t('Raised to the highest level')}</Text>;
    }
    if (!account) {
      return (
        <ConnectWalletButton
          scale='ld'
          width='277px'
          height='45px'
          padding='0 10px'
        />
      );
    }

    // 升级
    if (maxExp === 0 || (curExp && curExp >= maxExp)) {
      return (
        <Button
          variant='purple'
          disabled={pending}
          width='277px'
          height='45px'
          padding='0'
          onClick={async () => {
            try {
              setPending(true);
              const res = await Api.PlanetApi.upgradePlanet(planetId);
              if (Api.isSuccess(res)) {
                toastSuccess(t('Upgrade succeeded'));
                getStarUpgradeInfo();
                dispatch(fetchPlanetInfoAsync([planetId]));
              }
            } catch (error: any) {
              console.log(error);
            } finally {
              setPending(false);
            }
          }}
        >
          <Text color='textPrimary' fontSize='16px' bold>
            {pending ? <Dots>{t('Upgrading')}</Dots> : t('Upgrade Planet')}
          </Text>
        </Button>
      );
    }
    // 吞噬
    return (
      <Button
        variant='purple'
        disabled={pending || !usableMaterialIds.length}
        width='277px'
        height='45px'
        padding='0'
        onClick={async () => {
          try {
            setPending(true);
            const isSuccess = await upgrade(planetId, usableMaterialIds);
            dispatch(setActiveMaterialMap(null));
            dispatch(fetchPlanetInfoAsync([planetId]));
            // toastSuccess(t('Upgrade succeeded'));
            setPending(false);
          } catch (error: any) {
            setPending(false);
            const msg = error?.data?.message;
            const errorMsg = msg?.substring(
              msg?.indexOf('execution reverted: ') + 20,
            );
            if (errorMsg) toastError(t('errorMsg'));
            else
              toastError(
                'Please try again. Confirm the transaction and make sure you are paying enough gas!',
              );
          }
        }}
      >
        <Text color='textPrimary' fontSize='16px' bold>
          {pending ? <Dots>{t('Devour')}</Dots> : t('Devour')}
        </Text>
      </Button>
    );
  }, [
    account,
    curExp,
    maxExp,
    dispatch,
    planetId,
    pending,
    isHighestLevel,
    usableMaterialIds,
    upgrade,
    toastError,
    toastSuccess,
    t,
    getStarUpgradeInfo,
  ]);

  return (
    <GraphicsCard
      width='1582px'
      height='626px'
      borderWidth={2}
      padding='30px 68px'
      mt='113px'
    >
      {!guides.guideFinish && guides.finish && steps.length - 1 >= guides.step && (
        <Steps
          enabled={stepsEnabled}
          steps={steps}
          initialStep={0}
          options={{
            exitOnOverlayClick: false,
          }}
          onExit={step => {
            setStepsEnabled(false);
            setGuide(steps.length + 1);
            // dispatch(storeAction.toggleVisible({ visible: true }));
          }}
        />
      )}

      <Flex justifyContent='space-between'>
        <Flex
          flexDirection='column'
          alignItems='center'
          justifyContent='flex-end'
          width={475}
          className='planet_level_head'
        >
          <MysteryBoxFlexStyled>
            <MysteryBoxBaseNewStyled quality={mysteryBoxQualities.SUPER}>
              <MysteryBoxStarStyled quality={mysteryBoxQualities.SUPER}>
                <Globe
                  rotate
                  margin='auto'
                  scale='ld'
                  shadow={QualityColor[upgradeInfo.now_planet_info?.rarity]}
                  url={upgradeInfo.now_planet_info?.picture1}
                />
              </MysteryBoxStarStyled>
            </MysteryBoxBaseNewStyled>
          </MysteryBoxFlexStyled>
        </Flex>

        <Flex
          flex={1}
          flexDirection='column'
          alignItems='center'
          justifyContent='space-between'
        >
          <Flex mt='15px' justifyContent='center' alignItems='center'>
            <Flex width='301px' mr='20px' alignItems='center'>
              <GradeBox>
                <Text fontSize='31px' bold shadow='primary'>
                  Lv {upgradeInfo.now_planet_info?.level}
                </Text>
              </GradeBox>
              <Image
                width={75}
                height={40}
                margin='0 26px'
                src='/images/commons/icon/upgrade.png'
              />
              <GradeBox>
                <Text fontSize='31px' bold color='up' shadow='secondary'>
                  Lv {upgradeInfo.estimate_planet_info?.level}
                </Text>
              </GradeBox>
            </Flex>
            <Flex flexDirection='column' alignItems='center'>
              {!!maxExp && (
                <>
                  <Flex
                    width='100%'
                    justifyContent='space-between'
                    alignItems='center'
                  >
                    <Text fontSize='24px' fontStyle='normal' mark bold>
                      {t('Upgrade experience')}
                    </Text>
                    {/* <Text fontSize='20px'>{t('升级需要吞噬同种族星球')}</Text> */}
                  </Flex>
                  <StripedProgress
                    preStep={`${preExpStep}%`}
                    step={`${expStep}%`}
                  />
                  <Flex
                    width='100%'
                    justifyContent='space-between'
                    alignItems='center'
                  >
                    <Text fontSize='20px'>{`${curExp} / ${maxExp}`}</Text>
                    {Object.keys(activeMaterialMap).length > 0 && (
                      <Text fontSize='20px' color='textUp'>
                        {t('Estimated +%value%', { value: expectedExp })}
                      </Text>
                    )}
                  </Flex>
                </>
              )}
            </Flex>
          </Flex>
          <Flex mt='10px'>{!!maxExp && StarAddBox}</Flex>
          <GraphicsCard mt='47px' width='853px' height='178px' stripe isRadius>
            <Flex justifyContent='space-between' alignItems='flex-end'>
              <Box>
                <Flex>
                  <Image
                    width={31}
                    height={35}
                    src='/images/commons/star/LV.png'
                  />
                  <Box ml='10px'>
                    <Text bold mark fontStyle='normal'>
                      {t('Effect after upgrade')}
                    </Text>
                    <Flex justifyContent='space-between' alignItems='center'>
                      <Text small color='textSubtle'>
                        {t('Building grade up limit')}
                      </Text>
                      <Text small>
                        +{upInfo?.build_level}(Lv.
                        {upInfo?.estimate_max_building_level + 1})
                      </Text>
                    </Flex>
                  </Box>
                </Flex>
                <UpgradeCost
                  stone={upgradeInfo.consume_stone}
                  spices={upgradeInfo.consume_population}
                  energy={upgradeInfo.consume_energy}
                  planetInfo={planetInfo[planetId]}
                />
              </Box>
              <Flex mt='30px' flexDirection='column' alignItems='center'>
                {maxExp && curExp < maxExp ? (
                  <Text mb='4px' fontSize='16px' color='failure'>
                    *{t('Lack of upgrade experience')}
                  </Text>
                ) : null}
                {rendeButton}
              </Flex>
            </Flex>
          </GraphicsCard>
        </Flex>
      </Flex>

      {/* <ModalWrapper
        title={t('Upgrade Planet')}
        visible={visible}
        setVisible={() => setVisible(false)}
      >
        <Flex padding='40px'>
          <StarCom scale='ld' quality={2} mr='40px' />
          <Flex flex={1} flexDirection='column' justifyContent='space-between'>
            <Text fontSize='22px'>
              {t(
                'The upgrade process will last for 6 hours, during which the planet will not be able to operate. Do you want to continue?',
              )}
            </Text>
            {!account ? (
              <ConnectWalletButton scale='ld' width='270px' padding='0 10px' />
            ) : (
              <Button
                disabled={pending}
                width='300px'
                padding='0'
                onClick={async () => {
                  try {
                    setPending(true);
                    const isSuccess = await upgrade(
                      planetId,
                      usableMaterialIds,
                    );
                    dispatch(setActiveMaterialMap(null));
                    toastSuccess(t('Upgrade succeeded'));
                    setPending(false);
                    setVisible(false);
                  } catch (error: any) {
                    const msg = error?.data?.message;
                    const errorMsg = msg?.substring(
                      msg?.indexOf('execution reverted: ') + 20,
                    );
                    if (errorMsg)
                      toastError(t(`There are ${errorMsg} planets`));
                    setPending(false);
                  }
                }}
              >
                {pending ? (
                  <Dots>{t('Confirm to upgrade')}</Dots>
                ) : (
                  <Text fontSize='inherit'>{t('Confirm to upgrade')}</Text>
                )}
              </Button>
            )}
          </Flex>
        </Flex>
      </ModalWrapper> */}
    </GraphicsCard>
  );
};

export default Upgrade;
