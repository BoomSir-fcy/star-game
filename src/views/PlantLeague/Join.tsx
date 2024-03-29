import React, { useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Flex, Text, Button } from 'uikit';
import styled, { keyframes } from 'styled-components';
import { StarAddBtn } from 'components';
import { useStore } from 'state/util';
import { qualities } from 'uikit/theme/types';
import { useToast } from 'contexts/ToastsContext';
import { useDispatch } from 'react-redux';
import { fetchAllianceViewAsync } from 'state/alliance/reducer';
import { useTranslation } from 'contexts/Localization';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { useConnectWallet } from 'contexts/ConnectWallet';
import { orderInfo } from 'state/types';
import { useRemoveAlliance } from './hook';

const rotate = keyframes`
  0% {
    transform: rotate(360deg);
  }
  100% {
    transform: rotate(0);
  }
`;

const GalaxyBg = styled(Box)`
  width: 60%;
  height: 80%;
  position: absolute;
  z-index: -1;
  top: 84px;
  left: 150px;
  transform: rotate(0);
  img {
    width: 100%;
    height: 100%;
    animation: ${rotate} 60s infinite linear;
  }
`;

const BigStarAddBtn = styled(StarAddBtn)`
  width: 200px !important;
  height: 200px !important;
`;

const StarStyleImg = styled.img`
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.colors.goldBorder};
  width: 65%;
`;

const JoinTheAlliance: React.FC<{
  callbackGuide: () => void;
}> = ({ callbackGuide }) => {
  const { t } = useTranslation();
  const { account } = useActiveWeb3React();
  const { onConnectWallet } = useConnectWallet();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toastError, toastSuccess, toastWarning } = useToast();
  const { order, alliance } = useStore(p => p.alliance.allianceView);
  const workingList = useStore(p => p.alliance.workingPlanet);
  const [allianceList, setAllianceList] = useState<orderInfo[]>([]);
  const [newIds, setNewIds] = useState<number[]>([]);
  const { RemoveStar } = useRemoveAlliance();
  const [Loading, setLoading] = useState(false);

  // 删除星球
  const Remove = useCallback(
    async (id: number) => {
      const list = allianceList.filter(item => {
        return item.planetId !== id;
      });
      setAllianceList(list);
      const newList = newIds.concat([]);
      const index = newList.indexOf(Number(id));
      newList.splice(index, 1);
      setNewIds(newList);
    },
    [allianceList, newIds, setNewIds, setAllianceList],
  );

  // 提交修改
  const SubmitList = useCallback(async () => {
    if (Loading) return;
    setLoading(true);
    const newIdsStr = newIds.join();
    const workingListStr = workingList.join();
    if (newIdsStr === workingListStr) {
      toastError(t('The alliance has not changed'));
      return;
    }
    try {
      await RemoveStar(newIds);
      toastSuccess(t('Remove Succeeded'));
    } catch (e) {
      console.error(e);
      toastError(t('Remove Failed'));
    }
    dispatch(fetchAllianceViewAsync());
    setLoading(false);
  }, [
    RemoveStar,
    toastError,
    toastSuccess,
    dispatch,
    t,
    Loading,
    workingList,
    newIds,
  ]);

  const addStar = (id: any) => {
    if (!account) {
      onConnectWallet();
      return;
    }
    callbackGuide();
    navigate(`/star/planet?hide=true&choose=${id || 1}`);
  };

  useEffect(() => {
    setNewIds(workingList);
  }, [workingList]);

  useEffect(() => {
    if (order?.length) {
      setAllianceList(order);
    }
  }, [order]);

  const gotoPlantDetail = useCallback(
    (planetId: number) => {
      navigate(`/star?id=${planetId}`);
    },
    [navigate],
  );

  return (
    <Box
      position='relative'
      width='40%'
      padding='0 80px 0 70px'
      className='planet planet-union'
    >
      <Flex
        mb='-36px'
        alignItems='center'
        justifyContent='center'
        className='join-union'
      >
        <StarAddBtn
          ball
          ballWorking={alliance.working > 0}
          // name={allianceList && allianceList[0]?.planet?.name}
          onRemove={() => Remove(allianceList[0]?.planetId)}
          onPlantClick={() => {
            gotoPlantDetail(allianceList[0]?.planetId);
          }}
          showIcon
          callBack={() => addStar(allianceList && allianceList[0]?.planetId)}
          imgBorder={
            (allianceList && allianceList[0]?.planet.rarity) ||
            qualities.ORDINARY
          }
          size='200px'
          url={
            allianceList && allianceList[0]?.planet
              ? allianceList[0]?.planet.picture1
              : ''
          }
          No={1}
          Leve={(allianceList && allianceList[0]?.planet?.level) || ''}
        />
      </Flex>
      <Flex alignItems='center' justifyContent='space-between'>
        <StarAddBtn
          ball
          ballWorking={alliance.working > 0}
          // name={allianceList && allianceList[4]?.planet?.name}
          onRemove={() => Remove(allianceList[4]?.planetId)}
          onPlantClick={() => {
            gotoPlantDetail(allianceList[4]?.planetId);
          }}
          showIcon
          callBack={() => addStar(allianceList && allianceList[4]?.planetId)}
          imgBorder={
            (allianceList && allianceList[4]?.planet.rarity) ||
            qualities.ORDINARY
          }
          size='200px'
          url={
            allianceList && allianceList[4]?.planet
              ? allianceList[4]?.planet.picture1
              : ''
          }
          No={5}
          Leve={(allianceList && allianceList[4]?.planet?.level) || ''}
        />
        <Box marginTop='76px'>
          <Button
            disabled={Loading}
            variant='vsRefresh'
            width='100px'
            style={{ fontSize: '24px' }}
            padding='0'
            onClick={SubmitList}
          >
            {t('Save')}
          </Button>
        </Box>
        <StarAddBtn
          ball
          ballWorking={alliance.working > 0}
          // name={allianceList && allianceList[1]?.planet?.name}
          onRemove={() => Remove(allianceList[1]?.planetId)}
          onPlantClick={() => {
            gotoPlantDetail(allianceList[1]?.planetId);
          }}
          showIcon
          callBack={() => addStar(allianceList && allianceList[1]?.planetId)}
          imgBorder={
            (allianceList && allianceList[1]?.planet.rarity) ||
            qualities.ORDINARY
          }
          size='200px'
          url={
            allianceList && allianceList[1]?.planet
              ? allianceList[1]?.planet.picture1
              : ''
          }
          No={2}
          Leve={(allianceList && allianceList[1]?.planet?.level) || ''}
        />
      </Flex>
      <Flex alignItems='center' justifyContent='center'>
        <StarAddBtn
          ball
          ballWorking={alliance.working > 0}
          // name={allianceList && allianceList[3]?.planet?.name}
          onRemove={() => Remove(allianceList[3]?.planetId)}
          onPlantClick={() => {
            gotoPlantDetail(allianceList[3]?.planetId);
          }}
          showIcon
          callBack={() => addStar(allianceList && allianceList[3]?.planetId)}
          imgBorder={
            (allianceList && allianceList[3]?.planet.rarity) ||
            qualities.ORDINARY
          }
          size='200px'
          url={
            allianceList && allianceList[3]?.planet
              ? allianceList[3]?.planet.picture1
              : ''
          }
          No={4}
          Leve={(allianceList && allianceList[3]?.planet?.level) || ''}
        />
        <StarAddBtn
          ball
          ballWorking={alliance.working > 0}
          // name={allianceList && allianceList[2]?.planet?.name}
          onRemove={() => Remove(allianceList[2]?.planetId)}
          onPlantClick={() => {
            gotoPlantDetail(allianceList[2]?.planetId);
          }}
          showIcon
          callBack={() => addStar(allianceList && allianceList[2]?.planetId)}
          imgBorder={
            (allianceList && allianceList[2]?.planet.rarity) ||
            qualities.ORDINARY
          }
          size='200px'
          url={
            allianceList && allianceList[2]?.planet
              ? allianceList[2]?.planet.picture1
              : ''
          }
          No={3}
          Leve={(allianceList && allianceList[2]?.planet?.level) || ''}
        />
      </Flex>
      <GalaxyBg>
        <img src='/images/planetary_alliance/1.png' alt='' />
      </GalaxyBg>
    </Box>
  );
};

export default JoinTheAlliance;
