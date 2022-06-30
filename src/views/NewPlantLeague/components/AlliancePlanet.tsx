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

const AlliancePlanet: React.FC<{
  setChoosePlant: (e) => void;
  setPlantManageModule: (e) => void;
}> = ({ setPlantManageModule, setChoosePlant }) => {
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
        url: allianceList[i]?.planet?.picture1 || '',
        No: i + 1,
        Leve: allianceList[i]?.planet?.level || '',
        resources:
          !allianceList[i]?.planet?.stone_enough ||
          !allianceList[i]?.planet?.population_enough ||
          !allianceList[i]?.planet?.energy_enough,
      };
      arr.push(obj);
    }
    return arr;
  }, [alliance, allianceList]);

  const addStar = (id: any) => {
    if (!account) {
      onConnectWallet();
      return;
    }
    // callbackGuide();
    navigate('/choose-planet');
  };

  // const getResourcesText = (ore,splce,energy)=>{
  //   if(!ore){

  //   }
  // }
  useEffect(() => {
    setNewIds(workingList);
  }, [workingList]);

  useEffect(() => {
    if (order?.length) {
      setAllianceList(order);
    }
  }, [order]);

  return (
    <Content>
      <Box className='section3'>
        <Box className='ui_base u_p3d'>
          <CenterBox className='ball_c'>
            <Flex flexDirection='column' alignItems='center' height='100%'>
              <Text mt='18px' fontSize='14px'>
                {t('Power')}
              </Text>
              <MarkText fontSize='20px' fontStyle='normal' bold>
                {alliance.power}
              </MarkText>
            </Flex>
          </CenterBox>
          <Box className='base u_p3d'>
            {/* <Box className='line1' /> */}
            <Box className='line2' />
            {PlantList.map((item, index) => (
              <Box
                key={item.className}
                className={`ball_base u_p3d ${item.className}`}
              >
                <Ball
                  className='ball'
                  ball
                  ballWorking={item.ballWorking}
                  name={item.name}
                  onPlantClick={() => {
                    setPlantManageModule(true);
                    setChoosePlant(allianceList[index]);
                  }}
                  callBack={() => {
                    if (!item.planetId) {
                      addStar(item.planetId);
                    } else {
                      setPlantManageModule(true);
                      setChoosePlant(allianceList[index]);
                    }
                  }}
                  imgBorder={item.rarity}
                  size='200px'
                  width_height='160px'
                  url={item.url}
                  No={item.No}
                  Leve={item.Leve}
                  resources={item.resources}
                  resourcesText={t('资源不足')}
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
