import React, { useEffect, useCallback, useState, useMemo } from 'react';
import { useTranslation } from 'contexts/Localization';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { useNavigate } from 'react-router-dom';
import { useToast } from 'contexts/ToastsContext';
import { useStore } from 'state';
import { Text, Box, Flex, MarkText } from 'uikit';
import { qualities } from 'uikit/theme/types';
import { useDispatch } from 'react-redux';
import { orderInfo } from 'state/types';
import { useConnectWallet } from 'contexts/ConnectWallet';
import { fetchAllianceViewAsync } from 'state/alliance/reducer';
import { Ball, CenterBox, Content } from './AlliancePlanetStyle';
import './AlliancePlanetAround.css';
import { useRemoveAlliance } from '../hook';

const AlliancePlanet: React.FC = () => {
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

  const PlantList = useMemo(() => {
    const ballWorking = alliance.working > 0;
    const arr = [];
    for (let i = 0; i < 5; i++) {
      const obj = {
        className: `ball_${i + 1}`,
        ballWorking,
        name: allianceList[i]?.planet?.name,
        planetId: allianceList[i]?.planetId,
        rarity: allianceList[i]?.planet?.rarity || qualities.ORDINARY,
        url: allianceList[i]?.planet?.picture1,
        No: i + 1,
        Leve: allianceList[i]?.planet?.level || '',
      };
      arr.push(obj);
    }
    return arr;
  }, [alliance, allianceList]);

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
    // callbackGuide();
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
    <Content>
      <Box className='section3'>
        <Box className='ui_base u_p3d'>
          <CenterBox className='ball_c'>
            <Flex flexDirection='column' alignItems='center' height='100%'>
              <Text mt='18px' fontSize='14px'>
                {t('Combat Power')}
              </Text>
              <MarkText fontSize='20px' fontStyle='normal' bold>
                {123123}
              </MarkText>
            </Flex>
          </CenterBox>
          <Box className='base u_p3d'>
            {/* <Box className='line1' /> */}
            <Box className='line2' />
            {PlantList.map(item => (
              <Box
                key={item.className}
                className={`ball_base u_p3d ${item.className}`}
              >
                <Ball
                  className='ball'
                  ball
                  ballWorking={item.ballWorking}
                  name={item.name}
                  onRemove={() => Remove(item.planetId)}
                  onPlantClick={() => gotoPlantDetail(item.planetId)}
                  showIcon
                  callBack={() => addStar(item.planetId)}
                  imgBorder={item.rarity}
                  size='200px'
                  url={item.url}
                  No={item.No}
                  Leve={item.Leve}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Content>
  );
};

export default AlliancePlanet;