import React from 'react';
import styled from 'styled-components';
import { Card, Flex, Box, Button, Text, Image } from 'uikit';
import StarCom from 'components/StarCom';

import { Qualities } from 'uikit/theme/types';
import { QualityColor } from 'uikit/theme/colors';

import { PlanetDesc } from './PlanetDesc';

const CardBox = styled(Card)`
  width: 760px;
  height: 200px;
  padding: 18px;
  margin-bottom: 20px;
`;

const Desc = styled(Flex)`
  padding-bottom: 15px;
  border-bottom: 1px solid #424958;
`;

export const PlanetBox: React.FC<{
  status?: string;
  level: Qualities;
}> = ({ status, level = 'rare' }) => {
  const [state, setState] = React.useState({
    time: 86970,
  });
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

  React.useEffect(() => {
    countDown();
    return () => {
      if (timer) clearInterval(timer);
    };
  });

  return (
    <CardBox>
      <Flex>
        <StarCom quality={level} />
        <Flex ml='29px' flex='1' flexDirection='column'>
          <Desc justifyContent='space-between'>
            {status === 'upgrade' ? (
              <>
                <Flex alignItems='center'>
                  <Text color={QualityColor[level]} bold>
                    传说
                  </Text>
                  <Text ml='11px'>Lv1</Text>
                </Flex>
                <Flex flex='1' justifyContent='flex-end' alignItems='center'>
                  <Text color='textSubtle' fontSize='20px' mr='28px'>
                    {formatTime(state.time)}
                  </Text>
                  <Text shadow='primary' fontSize='24px' mr='27px'>
                    升级中
                  </Text>
                  <Image
                    src='/images/commons/icon/icon_arrow_right.png'
                    width={22}
                    height={27}
                  />
                </Flex>
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
              <PlanetDesc />
            ) : (
              <>
                <Image
                  src='/images/commons/icon/icon-premiumGems.png'
                  width={60}
                  height={60}
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