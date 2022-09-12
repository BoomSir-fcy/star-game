import React, { useState, useCallback } from 'react';
import { Button, Flex, Box, MarkText, Text, Image } from 'uikit';
import { useTranslation } from 'contexts/Localization';
import styled from 'styled-components';
import { orderInfo } from 'state/types';
import { PlanetBall, RaceAvatar } from 'components';
import { QualityColor, RaceTypeColor } from 'uikit/theme/colors';
import { useNavigate } from 'react-router-dom';
import { PlanetDesc } from 'views/NewPlanet/components/PlanetDesc';
import { getPlanetRarity } from 'utils/planetRarity';

const OutBox = styled(Box)`
  width: 680px;
  height: 370px;
  background: linear-gradient(270deg, #162d37, #0b1c22, #0a161b);
  border: 2px solid ${({ theme }) => theme.colors.borderPrimary};
`;

const StarImg = styled.img`
  width: 15px;
  height: 13px;
`;

const ManageModule: React.FC<{
  PlantManageModule: boolean;
  setPlantManageModule: (e) => void;
  ChoosePlant: orderInfo;
}> = ({ PlantManageModule, ChoosePlant = {}, setPlantManageModule }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { planet: planetInfo } = ChoosePlant;

  const addStar = (id: number) => {
    // if (!account) {
    //   onConnectWallet();
    //   return;
    // }
    // callbackGuide();
    navigate('/star/planet');
  };

  const gotoPlantDetail = useCallback(
    (planetId: number) => {
      navigate(`/star?id=${planetId}`);
    },
    [navigate],
  );
  const WorkCount = useCallback((time: number, count: number) => {
    let num = 0;
    const toDay = new Date(new Date().toLocaleDateString()).getTime() / 1000;
    if (time >= toDay) {
      num = count;
    }
    return num;
  }, []);
  return (
    <Box
      display={PlantManageModule ? 'block' : 'none'}
      zIndex={1}
      position='absolute'
      left={0}
      bottom={-20}
    >
      <OutBox padding='26px'>
        <Flex
          justifyContent='flex-end'
          width={32}
          height={32}
          right={10}
          top={10}
          position='absolute'
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setPlantManageModule(false);
          }}
        >
          <Image width={32} height={32} src='/images/commons/icon/guanbi.png' />
        </Flex>
        <Flex
          mb='20px'
          height='77%'
          justifyContent='space-between'
          alignItems='center'
          pt='20px'
        >
          <Flex
            height='100%'
            flexDirection='column'
            justifyContent='space-between'
            width='33%'
          >
            <PlanetBall
              rotate
              scale='xl'
              shadow={QualityColor[planetInfo?.rarity]}
              url={planetInfo?.picture1}
              showUnion
              IconHeight={58}
              IconWidth={60}
            />
            <Flex alignItems='baseline' pt='16px'>
              <Text mr='10px'>{t('Power')}</Text>
              <MarkText fontStyle='normal' fontSize='20px' bold>
                {planetInfo?.power}
              </MarkText>
            </Flex>
          </Flex>
          <Flex
            flexDirection='column'
            justifyContent='space-between'
            height='100%'
            width='43%'
          >
            <Flex alignItems='baseline'>
              <MarkText padding={0} bold fontStyle='normal' color='textSubtle'>
                {t('Production')}
              </MarkText>
              <Text ml='20px' small>
                {t('Explorations in 24h:')}
                &nbsp;
                {WorkCount(planetInfo?.work_time, planetInfo?.work_count)}
              </Text>
            </Flex>
            <PlanetDesc info={planetInfo} />
          </Flex>
          <Flex
            flexDirection='column'
            justifyContent='space-between'
            height='100%'
            width='22%'
          >
            <MarkText padding={0} fontStyle='normal' bold>
              {t('Battle Attribute')}
            </MarkText>
            <Box>
              <Text small color='textSubtle'>
                {t('Building Count')}
              </Text>
              <Text small>{planetInfo?.build_count}</Text>
            </Box>
            <Box>
              <Text small color='textSubtle'>
                {t('Biohack')}
              </Text>
              <Text small>
                {t('Power')} +{planetInfo?.ak_buff}
              </Text>
            </Box>
            <Box>
              <Text small color='textSubtle'>
                {t('Planet Cultivation')}
              </Text>
              <Text small>
                {t('Power')} +{planetInfo?.strengthen_buff}
              </Text>
            </Box>
          </Flex>
        </Flex>
        <Flex height='17%' justifyContent='space-between' alignItems='center'>
          <Flex height='100%' width='33%' justifyContent='space-between'>
            <RaceAvatar width='46px' height='46px' race={planetInfo?.race} />
            <Flex
              ml='10px'
              flexDirection='column'
              justifyContent='space-between'
            >
              <Text
                fontSize='16px'
                color={QualityColor[planetInfo?.rarity]}
                bold
              >
                {t(getPlanetRarity(planetInfo?.rarity))}
              </Text>
              <Text
                fontSize='16px'
                color={RaceTypeColor[planetInfo?.race || 3]}
                bold
              >
                {planetInfo?.race === 1
                  ? t('race-1')
                  : planetInfo?.race === 2
                  ? t('race-2')
                  : t('race-3')}
              </Text>
            </Flex>
            <Flex
              ml='10px'
              flexDirection='column'
              justifyContent='space-between'
            >
              <Text fontSize='16px' bold>
                Lv {planetInfo?.level}
              </Text>
              <Flex justifyContent='space-between' alignItems='center'>
                <StarImg src='/images/commons/icon/star-a.png' />
                <Text fontSize='14px' bold>
                  x{planetInfo?.strengthenLevel}
                </Text>
              </Flex>
            </Flex>
          </Flex>
          <Flex
            height='100%'
            flexDirection='column'
            justifyContent='space-between'
          >
            <Text fontSize='16px'>{t('Token')}:</Text>
            <Text fontSize='14px'>{planetInfo?.id}</Text>
          </Flex>
          <Button
            width='200px'
            height='45px'
            variant='purple'
            onClick={() => {
              navigate(`/star?id=${planetInfo?.id}`);
            }}
          >
            <Text color='textPrimary' bold>
              {t('Manage Planet')}
            </Text>
          </Button>
        </Flex>
      </OutBox>
    </Box>
  );
};

export default ManageModule;
