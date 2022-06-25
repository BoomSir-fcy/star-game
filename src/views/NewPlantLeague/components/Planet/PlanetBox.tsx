import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Card, Flex, Box, Text, Image, MarkText, Button } from 'uikit';
import { useNavigate } from 'react-router-dom';

import { QualityColor, RaceTypeColor } from 'uikit/theme/colors';
import { useTranslation } from 'contexts/Localization';
import { getPlanetRarity } from 'utils/planetRarity';
import { PlanetDesc } from './PlanetDesc';
import { StartImg } from './StartImg';

const CardBox = styled(Card)`
  width: 100%;
  height: 150px;
  padding: 16px 30px 16px 16px;
  margin-bottom: 24px;
  border: 1px solid rgb(137 136 136 / 35%);
`;

const Desc = styled(Flex)`
  padding-bottom: 30px;
  align-items: center;
`;

export const PlanetBox: React.FC<{
  setShowListModule: (e) => void;
  setChoosePlant: (e: Api.Planet.PlanetInfo) => void;
  info: Api.Planet.PlanetInfo;
  className?: string;
}> = ({ info, className, setChoosePlant, setShowListModule }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <CardBox className={className}>
      <Flex height='100%' alignItems='center'>
        <StartImg
          scale='md'
          iconWidth={47}
          iconHeight={45}
          shadow={info.rarity}
          url={info.picture1}
          showIcon={info.in_alliance > 0}
        />
        <Flex flex={1} ml='60px' flexDirection='column'>
          <Desc justifyContent='space-between'>
            <Flex alignItems='baseline'>
              <MarkText width='156px' ellipsis mr='30px' fontSize='26px' bold>
                {info.name}
              </MarkText>
              <MarkText width='60px' mr='30px' fontSize='20px' bold>
                Lv{info.level}
              </MarkText>
              <Flex width='156px' mr='30px' alignItems='baseline'>
                <Text mr='10px' color='textSubtle'>
                  {t('Building Count')}
                </Text>
                <Text bold>{info?.build_count}</Text>
              </Flex>
              <Flex width='120px' mr='30px' alignItems='baseline'>
                <Text mr='10px' color='textSubtle'>
                  {t('兵种总数')}
                </Text>
                <Text bold>{info?.arm_count}</Text>
              </Flex>
              <Text
                width='98px'
                mr='30px'
                color={QualityColor[info?.rarity]}
                bold
              >
                {t(getPlanetRarity(info?.rarity))}
              </Text>
              <Text mr='30px' color={RaceTypeColor[info?.race || 3]} bold>
                {info?.race === 1
                  ? t('race-1')
                  : info?.race === 2
                  ? t('race-2')
                  : t('race-3')}
              </Text>
              {/* <Text small color='textSubtle'>
                {t('Grid')}: {info.areaX}x{info.areaY}
              </Text> */}
            </Flex>
            <MarkText fontSize='20px' bold>
              {t('Power')} : {info.power}
            </MarkText>
          </Desc>
          <Flex
            justifyContent='space-between'
            alignItems='center'
            height='auto'
            flex={1}
          >
            <PlanetDesc info={info} />
            <Flex justifyContent='space-between'>
              <Button
                mr='26px'
                height='42px'
                onClick={() => {
                  navigate(`/star?id=${info.id}`);
                }}
              >
                <Text>{t('查看详情')}</Text>
              </Button>
              <Button
                onClick={() => {
                  setChoosePlant(info);
                  setShowListModule(true);
                }}
                height='42px'
              >
                <Text>{t('选择星球')}</Text>
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </CardBox>
  );
};
