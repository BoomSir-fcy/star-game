import React from 'react';
import styled from 'styled-components';
import { Card, Flex, Box, Button, Text, Image } from 'uikit';
import StarCom from 'components/StarCom';

import { Qualities } from 'uikit/theme/types';
import { QualityColor } from 'uikit/theme/colors';

import { planetInfo } from 'state/types';
import { PlanetDesc } from './PlanetDesc';

const CardBox = styled(Card)`
  width: 760px;
  height: 200px;
  padding: 16px;
`;

const Desc = styled(Flex)`
  padding-bottom: 5px;
  border-bottom: 1px solid #424958;
`;

export const PlanetBox: React.FC<{
  info: planetInfo;
  status?: string;
  level?: Qualities;
}> = ({ status = 'upgrade', level = 1, info }) => {
  const [state, setState] = React.useState({
    time: 86970,
  });
  let timer = null as any;

  // ORDINARY: 'ordinary', // 普通
  // GOOD: 'good', // 良好
  // RARE: 'rare', // 稀有
  // EPIC: 'epic', // 史诗
  // LEGEND: 'legend', // 传说
  // MYTHOLOGY: 'mythology', // 神话
  const getLevel = (num: number) => {
    let str = '';
    switch (num) {
      case 1:
        str = 'ordinary';
        break;
      case 2:
        str = 'good';
        break;
      case 3:
        str = 'rare';
        break;
      case 4:
        str = 'epic';
        break;
      case 5:
        str = 'legend';
        break;
      case 6:
        str = 'mythology';
        break;
      default:
        str = 'ordinary';
        break;
    }
    return str;
  };

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

  React.useEffect(() => {
    countDown();
    return () => {
      if (timer) clearInterval(timer);
    };
  });

  return (
    <CardBox>
      <Flex>
        <StarCom quality={2} />
        <Flex ml='29px' flex='1' flexDirection='column'>
          <Desc justifyContent='space-between'>
            {status === 'upgrade' ? (
              <>
                <Box>
                  <Text fontSize='24px'>{info.name}</Text>
                  <Flex alignItems='center' mt='2px'>
                    <Text color={QualityColor[level]} bold small>
                      传说
                    </Text>
                    <Text ml='12px' color='raceProtoss' bold small>
                      神族
                    </Text>
                    <Text ml='12px' bold small>
                      Lv{info.level}
                    </Text>
                    <Text ml='12px' small>
                      格子:{info.areaX}x{info.areaY}
                    </Text>
                  </Flex>
                </Box>
                {info?.update_finish_time > 0 && (
                  <Flex flex='1' flexDirection='column' alignItems='flex-end'>
                    <Flex
                      width='100%'
                      justifyContent='flex-end'
                      alignItems='center'
                    >
                      <Text shadow='primary' fontSize='24px' mr='15px'>
                        升级中
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
              </>
            ) : (
              <>
                <Flex alignItems='center'>
                  <Text>普通盲盒</Text>
                  <Text color='textSubtle' fontSize='24px' ml='24px'>
                    #006295
                  </Text>
                </Flex>
                <Flex flex='1' justifyContent='flex-end' alignItems='center'>
                  <Text shadow='primary' fontSize='24px' mr='27px'>
                    孵化中
                  </Text>
                  <Image
                    src='/images/commons/icon/icon_arrow_right.png'
                    width={22}
                    height={27}
                  />
                </Flex>
              </>
            )}
          </Desc>
          <Flex alignItems='center' height='auto' flex='1'>
            {status === 'upgrade' ? (
              <PlanetDesc info={info} />
            ) : (
              <>
                <Image
                  src='/images/commons/icon/icon-premiumGems.png'
                  width={69}
                  height={78}
                />
                <Text>普通、良好、稀有星球</Text>
              </>
            )}
          </Flex>
        </Flex>
      </Flex>
    </CardBox>
  );
};
