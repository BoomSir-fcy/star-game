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
import { Ball, CenterBox, Content } from './AlliancePlanetStyle';
import './AlliancePlanetAround.css';

const AlliancePlanet: React.FC<{
  guidesStep: number;
  stopAround: boolean;
  setGuide: (e) => void;
  setChoosePlant: (e) => void;
  setPlantManageModule: (e) => void;
}> = ({
  guidesStep,
  stopAround,
  setGuide,
  setPlantManageModule,
  setChoosePlant,
}) => {
  const { t } = useTranslation();
  const { account } = useActiveWeb3React();
  const { onConnectWallet } = useConnectWallet();
  const navigate = useNavigate();
  const { order, alliance } = useStore(p => p.alliance.allianceView);
  const [allianceList, setAllianceList] = useState<orderInfo[]>([]);
  const [ActiveId, setActiveId] = useState(0);

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
        resources: allianceList[i]
          ? !allianceList[i]?.planet?.stone_enough ||
            !allianceList[i]?.planet?.population_enough ||
            !allianceList[i]?.planet?.energy_enough
          : false,
        power: allianceList[i]?.planet?.power || 0,
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
    navigate('/star/planet');
  };

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
          <Box className={stopAround ? 'base u_p3d' : 'turnAround base u_p3d'}>
            {/* <Box className='line1' /> */}
            <Box className='line2' />
            {PlantList.map((item, index) => (
              <Box
                key={item.className}
                className={`ball_base u_p3d ${item.className}`}
              >
                <Ball
                  className={stopAround ? 'ball' : 'turnAroundBall ball'}
                  ball
                  ballWorking={item.ballWorking}
                  name={item.name}
                  onPlantClick={() => {
                    setActiveId(item.planetId);
                    setPlantManageModule(true);
                    setChoosePlant(allianceList[index]);
                    if (stopAround) {
                      setGuide(4);
                    }
                  }}
                  callBack={() => {
                    setActiveId(item.planetId);

                    if (!item.planetId) {
                      addStar(item.planetId);
                    } else {
                      setPlantManageModule(true);
                      setChoosePlant(allianceList[index]);
                      if (stopAround) {
                        setGuide(4);
                      }
                    }
                  }}
                  imgBorder={item.rarity}
                  size='200px'
                  width_height='170px'
                  showPower={ActiveId === item.planetId}
                  power={item.power}
                  url={item.url}
                  No={item.No}
                  Leve={item.Leve}
                  resources={item.resources}
                  resourcesText={t('Insufficient resources')}
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
