import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Card, Flex, Box, Text, Image, MarkText, Button } from 'uikit';
import { useNavigate } from 'react-router-dom';

import { QualityColor, RaceTypeColor } from 'uikit/theme/colors';
import { useTranslation } from 'contexts/Localization';
import { getPlanetRarity } from 'utils/planetRarity';
import { useDispatch } from 'react-redux';
import { StartImg } from 'views/NewPlantLeague/components/Planet/StartImg';
import { PlanetDesc } from './PlanetDesc';

const CardBox = styled(Card)<{ active?: boolean }>`
  width: 100%;
  height: 150px;
  padding: 16px 30px 16px 16px;
  margin-bottom: 24px;
  border: 1px solid #89888859;
  box-shadow: ${({ active }) =>
    active ? '0 0 10px 1px #4ffffb' : 'inset 0px 7px 3px 0px rgb(0 0 0 / 35%)'};
`;

const Desc = styled(Flex)`
  padding-bottom: 30px;
  align-items: center;
`;

export const PlanetBox: React.FC<{
  onSelect?: (info: Api.Planet.PlanetInfo) => void;
  info: Api.Planet.PlanetInfo;
  active?: boolean;
}> = ({ info, active, onSelect }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <CardBox active={active}>
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
              <Flex width='240px' mr='30px' alignItems='baseline'>
                <Text mr='10px' color='textSubtle'>
                  {t('Total number of arms')}
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
            <Text fontSize='20px' bold mr='20px' mark>
              {t('EXP')}: {info?.can_provided_exp}
            </Text>
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
                padding='0 20px'
                onClick={() => {
                  navigate(`/star?id=${info.id}`);
                }}
              >
                <Text>{t('Details')}</Text>
              </Button>
              <Button
                padding='0 20px'
                onClick={e => {
                  e.stopPropagation();
                  if (onSelect) onSelect(info);
                }}
                height='42px'
              >
                <Text>{active ? t('Cancel') : t('Choose Planet')}</Text>
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </CardBox>
  );
};
