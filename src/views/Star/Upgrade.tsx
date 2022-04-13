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
import { Image, Flex, Text, BgCard, Button, Card, Box, Dots } from 'uikit';
import { Api } from 'apis';
import { useStore } from 'state';
import { useWeb3React } from '@web3-react/core';
import { ConnectWalletButton } from 'components';
import { useTranslation } from 'contexts/Localization';
import useParsedQueryString from 'hooks/useParsedQueryString';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setActiveMaterialMap, setUpgradePlanetId } from 'state/planet/actions';
import { useToast } from 'contexts/ToastsContext';
import { GradeBox, UpgradeCard, Upgrading } from './components/upgrade';
import { useUpgrade } from './components/upgrade/hooks';

const MysteryBoxFlexStyled = styled(MysteryBoxStyled)`
  width: 320px;
  height: 366px;
  margin-right: 100px;
  margin-left: -40px;
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
  padding: 50px 20px;
`;

export interface UpgradePlanetInfo extends Api.Planet.PlanetInfo {
  build_level: number;
}

const Upgrade = () => {
  const { toastError } = useToast();
  const { account } = useWeb3React();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const parsedQs = useParsedQueryString();
  const planetId = Number(parsedQs.id);
  const [visible, setVisible] = useState(false);
  const [pending, setPending] = useState(false);
  const [upgradeInfo, setUpgradeInfo] = useState({
    estimate_planet_info: {} as UpgradePlanetInfo,
    now_planet_info: {} as UpgradePlanetInfo,
    material_planet_num: 5,
    success: false,
  });
  const [upgradeSuccess, setUpgradeSuccess] = useState({
    upgrade_is_end: true,
    upgrade_end_time: 0,
    upgrade_is_success: false,
  });

  const { upgrade } = useUpgrade();
  const { activeMaterialMap, upgradePlanetId } = useStore(p => p.planet);

  // 升级星球不一致，清空选择的材料星球
  useEffect(() => {
    if (upgradePlanetId !== planetId) {
      dispatch(setUpgradePlanetId(planetId));
      dispatch(setActiveMaterialMap(null));
    }
  }, []);

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
      console.log(error);
    }
  }, [planetId]);

  useEffect(() => {
    getUpgradeSuccess();
  }, [getUpgradeSuccess]);

  // 星球升级信息
  const getStarUpgradeInfo = useCallback(async () => {
    try {
      const res = await Api.PlanetApi.getUpgradePlanetInfo(planetId);
      if (Api.isSuccess(res)) {
        const {
          estimate_planet_info,
          now_planet_info,
          material_planet_num,
          success,
        } = res.data;
        setUpgradeInfo({
          estimate_planet_info: {
            ...estimate_planet_info,
            build_level: res.data?.estimate_max_building_level,
          },
          now_planet_info: {
            ...now_planet_info,
            build_level: res.data?.now_max_building_level,
          },
          material_planet_num,
          success,
        });
      } else {
        toastError(res.message);
      }
    } catch (error) {
      console.log(error);
    }
  }, [planetId]);

  useEffect(() => {
    if (upgradeSuccess.upgrade_is_end) getStarUpgradeInfo();
  }, [upgradeSuccess.upgrade_is_end, getStarUpgradeInfo]);

  const upInfo = useMemo(() => {
    return {
      build_level:
        upgradeInfo.estimate_planet_info?.build_level -
        upgradeInfo.now_planet_info?.build_level,
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
  }, [upgradeInfo.material_planet_num, planetId, activeMaterialMap]);

  const usableMaterialIds = useMemo(() => {
    // const materialIds = [] as number[];
    // Object.keys(activeMaterialMap).forEach(key => {
    //   if (activeMaterialMap[Number(key)]) materialIds.push(Number(key));
    // });
    // return materialIds;
    return Object.keys(activeMaterialMap);
  }, [activeMaterialMap]);
  return (
    <BgCard variant='big' padding='40px 68px'>
      {!upgradeSuccess.upgrade_is_end ? (
        <Upgrading
          timePeriod={upgradeSuccess.upgrade_end_time}
          info={upgradeInfo.now_planet_info}
          up={upInfo}
        />
      ) : (
        <Flex flexDirection='column'>
          <Flex alignItems='center'>
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
            <Flex>{StarAddBox}</Flex>
          </Flex>
          <Flex>
            <MysteryBoxFlexStyled>
              <MysteryBoxBaseNewStyled quality={mysteryBoxQualities.SUPER}>
                <MysteryBoxStarStyled quality={mysteryBoxQualities.SUPER}>
                  <StarCom variant='none' scale='ld' />
                </MysteryBoxStarStyled>
              </MysteryBoxBaseNewStyled>
            </MysteryBoxFlexStyled>
            <UpgradeCard info={upgradeInfo.now_planet_info} mr='33px' />
            <UpgradeCard
              info={upgradeInfo.estimate_planet_info}
              up={upInfo}
              mr='33px'
            />
            <StyledCard>
              <Flex flexDirection='column' justifyContent='space-between'>
                <Flex flexDirection='column'>
                  <Text small>
                    *
                    {t(
                      'Upgrade requires sacrifice to add planets of the same quality and level',
                    )}
                  </Text>
                  <Text small>
                    *
                    {t(
                      'To upgrade, you need to add a planet to become an alliance',
                    )}
                  </Text>
                  <Text small>
                    *
                    {t(
                      'All buildings can be upgraded when the level is higher than planet level 1',
                    )}
                  </Text>
                </Flex>
                <Flex mt='40px' flexDirection='column' alignItems='center'>
                  {!upgradeInfo.success && (
                    <Text fontSize='22px' color='failure'>
                      *{t('Energy building level does not meet')}
                    </Text>
                  )}
                  <Button
                    disabled={!upgradeInfo.success || !usableMaterialIds.length}
                    width='270px'
                    mt='20px'
                    padding='0'
                    onClick={() => setVisible(true)}
                  >
                    {t('Planet upgrade')}
                  </Button>
                </Flex>
              </Flex>
            </StyledCard>
          </Flex>
        </Flex>
      )}

      <ModalWrapper
        title={t('Planet upgrade')}
        visible={visible}
        setVisible={() => setVisible(false)}
      >
        <Flex padding='40px'>
          <StarCom scale='ld' quality={2} mr='40px' />
          <Flex flex={1} flexDirection='column' justifyContent='space-between'>
            <Text fontSize='22px'>
              {t(
                'The upgrade will last for 6 hours, during which the planet cannot be operated. Do you want to continue the upgrade?',
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
                    toastError(t('Upgrade succeeded'));
                    setPending(false);
                    setVisible(false);
                  } catch (error: any) {
                    const msg = error?.data?.message;
                    const errorMsg = msg?.substring(
                      msg?.indexOf('execution reverted: '),
                    );
                    if (errorMsg) toastError(errorMsg);
                    // toastError(t('Upgrade failed'));
                    setPending(false);
                  }
                }}
              >
                {pending ? (
                  <Dots>{t('Confirm upgrade')}</Dots>
                ) : (
                  t('Confirm upgrade')
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
