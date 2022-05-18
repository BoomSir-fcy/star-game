import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Card, Flex, Box, Text, Image } from 'uikit';
import StarCom from 'components/StarCom';

import { Qualities, qualities } from 'uikit/theme/types';
import { QualityColor, RaceTypeColor } from 'uikit/theme/colors';
import { useTranslation } from 'contexts/Localization';

import { getPlanetRarity } from 'utils/planetRarity';
import { PlanetDesc } from './PlanetDesc';

const CardBox = styled(Card)`
  width: 760px;
  height: 200px;
  padding: 16px;
  margin-bottom: 20px;
`;

const Desc = styled(Flex)`
  padding-bottom: 5px;
  border-bottom: 1px solid #424958;
`;

const ChooseBox = styled(Flex)`
  background: url('/images/commons/icon/choose.png') no-repeat;
  background-size: 100% 100%;
  width: 36px;
  height: 36px;
  justify-content: center;
  align-items: center;
`;

export const PlanetBox: React.FC<{
  choose?: boolean;
  info: Api.Planet.PlanetInfo;
  ChooseList?: number[];
  className?: string;
}> = ({ info, choose, ChooseList, className }) => {
  const { t } = useTranslation();
  const [state, setState] = useState({
    time: info?.status_countdown,
  });
  const [ChooseIndex, setChooseIndex] = useState(0);
  let timer = null as any;

  // 倒计时
  const countDown = () => {
    timer = setInterval(() => {
      const { time } = state;
      if (time > 0) {
        setState({
          ...state,
          time: time - 1,
        });
      } else {
        clearInterval(timer);
      }
    }, 1000);
  };

  const formatTime = (time: number) => {
    const hour = Math.floor(time / 3600);
    const min = Math.floor((time % 3600) / 60);
    const sec = time % 60;
    return `${hour}h:${min}m:${sec}s`;
  };

  useEffect(() => {
    if (ChooseList) {
      const index = ChooseList?.indexOf(info?.id);
      setChooseIndex(index);
    }
  }, [ChooseList, info?.id]);

  useEffect(() => {
    countDown();
    return () => {
      if (timer) clearInterval(timer);
    };
  });

  return (
    <CardBox>
      <Flex className={className}>
        <StarCom quality={info?.rarity} />
        <Flex ml='29px' flex='1' flexDirection='column'>
          <Desc justifyContent='space-between'>
            <Box>
              <Text fontSize='24px'>{info.name}</Text>
              <Flex alignItems='center' mt='2px'>
                <Text color={QualityColor[info?.rarity]} bold small>
                  {t(getPlanetRarity(info?.rarity))}
                </Text>
                <Text
                  ml='12px'
                  color={RaceTypeColor[info?.race || 3]}
                  bold
                  small
                >
                  {info?.race === 1
                    ? t('race-1')
                    : info?.race === 2
                    ? t('race-2')
                    : t('race-3')}
                </Text>
                <Text ml='12px' bold small>
                  Lv{info.level}
                </Text>
                <Text ml='12px' small>
                  {t('Grid')}:{info.areaX}x{info.areaY}
                </Text>
              </Flex>
            </Box>
            {info?.status_countdown > 0 && (
              <Flex flex='1' flexDirection='column' alignItems='flex-end'>
                <Flex
                  width='100%'
                  justifyContent='flex-end'
                  alignItems='center'
                >
                  <Text
                    shadow='primary'
                    fontSize='20px'
                    mr='15px'
                    ellipsis
                    style={{ flex: 1, textAlign: 'right' }}
                  >
                    {t('Upgrading')}
                  </Text>
                  <Image
                    src='/images/commons/icon/icon_arrow_right.png'
                    width={22}
                    height={27}
                  />
                </Flex>
                <Text
                  mt='2px'
                  color='textSubtle'
                  small
                  style={{
                    letterSpacing: '2px',
                  }}
                >
                  {formatTime(state.time)}
                </Text>
              </Flex>
            )}
            {choose && (
              <ChooseBox>
                <Text fontSize='22px'>
                  {ChooseIndex !== -1 ? ChooseIndex + 1 : ''}
                </Text>
              </ChooseBox>
            )}
            {/* <>
                <Flex alignItems='center'>
                  <Text>{t('普通盲盒')}</Text>
                  <Text color='textSubtle' fontSize='24px' ml='24px'>
                    #006295
                  </Text>
                </Flex>
                <Flex flex='1' justifyContent='flex-end' alignItems='center'>
                  <Text shadow='primary' fontSize='24px' mr='27px'>
                    {t('孵化中')}
                  </Text>
                  <Image
                    src='/images/commons/icon/icon_arrow_right.png'
                    width={22}
                    height={27}
                  />
                </Flex>
              </> */}
          </Desc>
          <Flex alignItems='center' height='auto' flex='1'>
            <PlanetDesc info={info} />
            {/* <>
                <Image
                  src='/images/commons/icon/icon-premiumGems.png'
                  width={69}
                  height={78}
                />
                <Text>{t('普通、良好、稀有星球')}</Text>
              </> */}
          </Flex>
        </Flex>
      </Flex>
    </CardBox>
  );
};
