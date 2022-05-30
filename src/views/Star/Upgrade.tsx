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
} from 'uikit';
import { Api } from 'apis';
import { useStore, storeAction } from 'state';
import { useWeb3React } from '@web3-react/core';
import { ConnectWalletButton } from 'components';
import { useTranslation } from 'contexts/Localization';
import useParsedQueryString from 'hooks/useParsedQueryString';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setActiveMaterialMap, setUpgradePlanetId } from 'state/planet/actions';
import { useToast } from 'contexts/ToastsContext';
import { Steps, Hints } from 'intro.js-react'; // 引入我们需要的组件
import { useGuide } from 'hooks/useGuide';
import { GradeBox, UpgradeCard, Upgrading } from './components/upgrade';
import { useUpgrade } from './components/upgrade/hooks';

import 'intro.js/introjs.css';
import { UpgradeCost } from './components/upgrade/UpgradeCost';

const MysteryBoxFlexStyled = styled(MysteryBoxStyled)`
  width: 320px;
  height: 366px;
  margin-right: 100px;
  margin-left: -40px;
  margin-top: 50px;
`;

const MysteryBoxBaseNewStyled = styled(MysteryBoxBaseStyled)`
  bottom: -40px;
`;
const MysteryBoxStarStyled = styled(MysteryBoxBoxStyled)`
  background: none;
  top: 0;
`;
const StyledCard = styled(Card)`
  width: 448px;
  /* height: 366px; */
  padding: 26px 20px;
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
  const [visible, setVisible] = useState(false);
  const [pending, setPending] = useState(false);
  const [upgradeInfo, setUpgradeInfo] = useState<Api.Planet.UpgradePlanetInfo>({
    consume_population: 0,
    consume_star: 0,
    consume_stone: 0,
    estimate_max_building_level: 2,
    estimate_planet_info: {} as Api.Planet.PlanetInfo,
    material_planet_num: 5,
    now_max_building_level: 1,
    now_planet_info: {} as Api.Planet.PlanetInfo,
    space_utilization: '0',
    upgrade_time: 0,
    success: false,
  });
  const [upgradeSuccess, setUpgradeSuccess] = useState({
    upgrade_is_end: true,
    upgrade_end_time: 0,
    upgrade_is_success: false,
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
  const { activeMaterialMap, upgradePlanetId } = useStore(p => p.planet);

  // 升级星球不一致，清空选择的材料星球
  useEffect(() => {
    if (upgradePlanetId !== planetId) {
      dispatch(setUpgradePlanetId(planetId));
      dispatch(setActiveMaterialMap(null));
    }
  }, [upgradePlanetId, planetId, dispatch]);

  // 星球是否升级成功
  const getUpgradeSuccess = useCallback(async () => {
    try {
      const res = await Api.PlanetApi.getUpgradeSuccess(planetId);
      if (Api.isSuccess(res)) {
        const { now_planet_info, ...rest } = res.data;
        setUpgradeInfo(p => {
          return { ...p, now_planet_info };
        });
        setUpgradeSuccess(rest);
      }
    } catch (error) {
      console.error(error);
    }
  }, [planetId]);

  useEffect(() => {
    getUpgradeSuccess();
  }, [getUpgradeSuccess]);

  // 星球升级信息
  const getStarUpgradeInfo = useCallback(async () => {
    try {
      const [planetCanLevel, planetUpgradeInfo] = await Promise.all([
        Api.PlanetApi.getUpgradePlanetInfo(planetId),
        Api.PlanetApi.getPlanetUpgradeInfo(planetId),
      ]);
      if (Api.isSuccess(planetUpgradeInfo)) {
        const {
          estimate_planet_info,
          now_planet_info,
          estimate_max_building_level,
          now_max_building_level,
        } = planetUpgradeInfo.data;
        setUpgradeInfo({
          ...planetUpgradeInfo.data,
          estimate_planet_info: {
            ...estimate_planet_info,
            build_level: estimate_max_building_level,
          },
          now_planet_info: {
            ...now_planet_info,
            build_level: now_max_building_level,
          },
          success: planetCanLevel.code === 0,
        });
      }
    } catch (error) {
      console.error(error);
    }
  }, [planetId]);

  useEffect(() => {
    if (upgradeSuccess.upgrade_is_end) getStarUpgradeInfo();
  }, [upgradeSuccess.upgrade_is_end, getStarUpgradeInfo]);

  const upInfo = useMemo(() => {
    return {
      build_level:
        upgradeInfo.estimate_max_building_level -
        upgradeInfo.now_max_building_level,
      hp:
        upgradeInfo.estimate_planet_info?.hp - upgradeInfo.now_planet_info?.hp,
      defense:
        upgradeInfo.estimate_planet_info?.defense -
        upgradeInfo.now_planet_info?.defense,
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
          url={activeMaterialMap[id] ? '/images/star/01.jpg' : ''}
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
  const getUpgradeExperience = useMemo(() => {
    const value = Number(upgradeInfo.space_utilization);
    if (!value || value <= 0) {
      return 0;
    }
    if (value && value > 100) {
      return 100;
    }
    return value;
  }, [upgradeInfo]);

  return (
    <BgCard variant='big' padding='30px 68px'>
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
            setGuide(step + 1);
            // dispatch(storeAction.toggleVisible({ visible: true }));
          }}
        />
      )}

      {!upgradeSuccess.upgrade_is_end ? (
        <Upgrading
          timePeriod={upgradeSuccess.upgrade_end_time}
          info={upgradeInfo.now_planet_info}
          up={upInfo}
        />
      ) : (
        <Flex justifyContent='space-between'>
          <Flex
            flexDirection='column'
            alignItems='center'
            className='planet_level_head'
          >
            <Flex width='320px' mr='50px' alignItems='center'>
              <GradeBox>
                <Text bold shadow='primary'>
                  Lv {upgradeInfo.now_planet_info?.level}
                </Text>
              </GradeBox>
              <Image
                width={82}
                height={42}
                margin='0 28px'
                src='/images/commons/icon/upgrade.png'
              />
              <GradeBox>
                <Text bold color='up' shadow='secondary'>
                  Lv {upgradeInfo.estimate_planet_info?.level}
                </Text>
              </GradeBox>
            </Flex>
            <Flex flexDirection='column' alignItems='center'>
              <Text fontSize='20px'>升级经验</Text>
              <StripedProgress step={`${getUpgradeExperience}%`} />
            </Flex>
            <MysteryBoxFlexStyled>
              <MysteryBoxBaseNewStyled quality={mysteryBoxQualities.SUPER}>
                <MysteryBoxStarStyled quality={mysteryBoxQualities.SUPER}>
                  <StarCom variant='none' scale='ld' />
                </MysteryBoxStarStyled>
              </MysteryBoxBaseNewStyled>
            </MysteryBoxFlexStyled>
          </Flex>

          <Flex flexDirection='column'>
            <Flex>{StarAddBox}</Flex>
            <Flex mb='10px' justifyContent='center'>
              <Text small>{t('添加同稀有度且同等级或低一个等级的星球')}</Text>
            </Flex>
            <Flex>
              <UpgradeCard
                info={upgradeInfo.now_planet_info}
                upgradeInfo={upgradeInfo.estimate_planet_info}
                up={upInfo}
                mr='33px'
              />
              <StyledCard>
                <Flex flexDirection='column' justifyContent='space-between'>
                  {/* <Flex flexDirection='column'>
                    <Text small>
                      *
                      {t(
                        'To upgrade, you need to sacrifice planets of the same quality and grade',
                      )}
                    </Text>
                    <Text small>
                      *
                      {t(
                        "When all buildings' grade is 1 level above the planet grade, the planet can be upgraded",
                      )}
                    </Text>
                  </Flex> */}
                  <UpgradeCost />
                  <Flex mt='30px' flexDirection='column' alignItems='center'>
                    <Button
                      disabled={
                        !upgradeInfo.success || !usableMaterialIds.length
                      }
                      width='270px'
                      padding='0'
                      onClick={() => setVisible(true)}
                    >
                      {t('Upgrade Planet')}
                    </Button>
                    {!upgradeInfo.success && (
                      <Text mt='10px' fontSize='22px' color='failure'>
                        *{t('Energy building grade does not meet the standard')}
                      </Text>
                    )}
                  </Flex>
                </Flex>
              </StyledCard>
            </Flex>
          </Flex>
        </Flex>
      )}

      <ModalWrapper
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
                    getUpgradeSuccess();
                    setTimeout(() => {
                      getUpgradeSuccess();
                    }, 10000);
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
      </ModalWrapper>
    </BgCard>
  );
};

export default Upgrade;
