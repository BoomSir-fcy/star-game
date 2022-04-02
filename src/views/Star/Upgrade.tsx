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
import useParsedQueryString from 'hooks/useParsedQueryString';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { setActiveMaterialMap } from 'state/planet/actions';
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
  const { account } = useWeb3React();
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
  const activeMaterialMap = useStore(p => p.planet.activeMaterialMap);

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
      }
    } catch (error) {
      console.log(error);
    }
  }, [planetId]);

  useEffect(() => {
    getStarUpgradeInfo();
  }, [getStarUpgradeInfo]);

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
            console.log(materialKey[i]);
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
          <Flex mb='20px' alignItems='center'>
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
                  <Text small>*升级需献祭添加相同品质、相同等级的星球</Text>
                  <Text small>*升级需添加成为联盟的星球</Text>
                  <Text small>*所有建筑等级大于星球等级1级时可升级</Text>
                </Flex>
                <Flex mt='87px' flexDirection='column' alignItems='center'>
                  {!upgradeInfo.success && (
                    <Text fontSize='22px' color='failure'>
                      *能量建筑等级不符合
                    </Text>
                  )}
                  <Button
                    disabled={!upgradeInfo.success || !usableMaterialIds.length}
                    width='270px'
                    mt='20px'
                    onClick={() => setVisible(true)}
                  >
                    星球升级
                  </Button>
                </Flex>
              </Flex>
            </StyledCard>
          </Flex>
        </Flex>
      )}

      <ModalWrapper
        title='星球升级'
        visible={visible}
        setVisible={() => setVisible(false)}
      >
        <Flex padding='40px'>
          <StarCom scale='ld' quality={2} mr='40px' />
          <Flex flexDirection='column' justifyContent='space-between'>
            <Text fontSize='22px'>
              升级会持续6小时，期间将无法操作星球，是否继续升级？
            </Text>
            {!account ? (
              <ConnectWalletButton scale='ld' width='270px' padding='0 10px' />
            ) : (
              <Button
                disabled={pending}
                width='270px'
                onClick={async () => {
                  setPending(true);
                  await upgrade(planetId, usableMaterialIds);
                  getUpgradeSuccess();
                  setTimeout(() => {
                    getUpgradeSuccess();
                  }, 5000);
                  setPending(false);
                  setVisible(false);
                }}
              >
                {pending ? <Dots>确认升级</Dots> : '确认升级'}
              </Button>
            )}
          </Flex>
        </Flex>
      </ModalWrapper>
    </BgCard>
  );
};

export default Upgrade;
