import React, { useState, useCallback } from 'react';
import { Button, Flex, Box, BgCard, MarkText, Text, Image } from 'uikit';
import { useTranslation } from 'contexts/Localization';
import styled from 'styled-components';
import { orderInfo } from 'state/types';
import { Globe, RaceAvatar } from 'components';
import { QualityColor, RaceTypeColor } from 'uikit/theme/colors';
import ScoringPanel from 'components/ScoringPanel';
import { getPlanetRarity } from 'utils/planetRarity';
import { useNavigate } from 'react-router-dom';

const IconUnion = styled(Image)`
  position: absolute;
  bottom: 0;
  right: 0;
`;
const InfoFlex = styled(Flex)`
  height: 100%;
  margin-left: 28px;
  flex-direction: column;
  justify-content: space-around;
  flex: 1;
`;
const ManageModule: React.FC<{
  ChoosePlant: orderInfo;
}> = ({ ChoosePlant }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { planet: planetInfo } = ChoosePlant;

  const addStar = (id: number) => {
    // if (!account) {
    //   onConnectWallet();
    //   return;
    // }
    // callbackGuide();
    navigate(`/star/planet?hide=true&choose=${id || 1}`);
  };

  const gotoPlantDetail = useCallback(
    (planetId: number) => {
      navigate(`/star?id=${planetId}`);
    },
    [navigate],
  );

  return (
    <Box zIndex={1} position='absolute' left={0} bottom={-20}>
      <BgCard variant='Sl' padding='30px'>
        <Flex height='100%' justifyContent='space-between' alignItems='center'>
          <Box position='relative'>
            <Globe
              scale='xl'
              margin='auto'
              shadow={QualityColor[planetInfo?.rarity]}
              url={planetInfo?.picture1}
            />
            <IconUnion
              width={60}
              height={58}
              src='/images/commons/icon/union.png'
            />
          </Box>
          <InfoFlex>
            <Flex alignItems='flex-end' justifyContent='space-between'>
              <Box>
                <Flex alignItems='baseline' mb='18px'>
                  <Text
                    fontSize='28px'
                    color={QualityColor[planetInfo?.rarity]}
                    bold
                    small
                  >
                    {t(getPlanetRarity(planetInfo?.rarity))}
                  </Text>
                  <Text
                    fontSize='18px'
                    ml='12px'
                    color={RaceTypeColor[planetInfo?.race || 3]}
                    bold
                  >
                    {planetInfo?.race === 1
                      ? t('race-1')
                      : planetInfo?.race === 2
                      ? t('race-2')
                      : t('race-3')}
                  </Text>
                  <Text ml='12px' fontSize='18px' bold>
                    Lv{planetInfo.level}
                  </Text>
                </Flex>
                <ScoringPanel
                  scale='el'
                  ellipsis
                  count={planetInfo?.strengthenLevel}
                />
              </Box>
              <RaceAvatar width='80px' height='80px' race={planetInfo?.race} />
            </Flex>
            <Text fontSize='14px'>Token: {planetInfo?.id}</Text>
            <Flex justifyContent='space-between'>
              <Button
                height='42px'
                onClick={() => gotoPlantDetail(planetInfo?.id)}
              >
                <Text>{t('管理')}</Text>
              </Button>
              <Button
                onClick={() => addStar(planetInfo?.id)}
                variant='danger'
                height='42px'
              >
                <Text>{t('替换')}</Text>
              </Button>
            </Flex>
          </InfoFlex>
        </Flex>
      </BgCard>
    </Box>
  );
};

export default ManageModule;
