import React from 'react';
import styled from 'styled-components';
import {
  Flex,
  Box,
  Text,
  GraphicsCard,
  MarkText,
  Image,
  Button,
  BoxProps,
} from 'uikit';
import { position } from 'styled-system';
import { RaceTypeColor } from 'uikit/theme/colors';
import { bulletType } from 'game/types';

import { raceData } from 'config/raceConfig';
import { useTranslation } from 'contexts/Localization';
import { getSpriteRes } from 'game/core/utils';
import RadarChart from 'game/core/RadarChart';
import MiniRaceAni from './miniRace';
import useSimulation from './useSimulation';

const Container = styled(Box)`
  position: absolute;
  right: 580px;
  top: 20px;
  width: 727px;
  height: 457px;
  background: linear-gradient(270deg, #162d37, #0b1c22, #0a161b);
  border: 2px solid #4ffffb;
  max-width: none;
  padding: 20px 25px;
  z-index: 1;
  ${position};
  &::before {
    z-index: 2;
  }
`;

const Content = styled(Flex)`
  position: relative;
  width: 100%;
  flex-direction: column;
  z-index: 10;
`;

const Head = styled(Flex)`
  width: 100%;
  margin-bottom: 20px;
`;

const Body = styled(Flex)`
  width: 100%;
`;

const Preview = styled(GraphicsCard)`
  width: 180px;
  height: 180px;
  padding: 0;
`;

const PreviewNumber = styled(Text)`
  position: absolute;
  right: 5px;
  bottom: 5px;
`;

const Group = styled(Flex)`
  width: 100%;
  margin-bottom: 15px;
`;
const GroupInfo = styled(Flex)`
  width: 33%;
`;

interface ArmsInfoProps extends BoxProps {
  armsData?: any;
  sid?: number;
  removeHandle?: () => void;
}
export const ArmsInfo: React.FC<ArmsInfoProps> = ({
  armsData,
  sid,
  removeHandle,
  ...props
}) => {
  const { t } = useTranslation();
  const { game_base_unit } = armsData;
  const [radarChart] = React.useState(
    new RadarChart({
      width: 180,
      height: 200,
      colorPolygon: '#FFFFFF',
      colorText: '#FFFFFF',
      fillColor: 'rgba(211, 95, 96, 0.5)',
      data: [
        {
          attr: 'HP',
          value: game_base_unit?.hp,
        },
        {
          attr: t('Defense'),
          value: game_base_unit?.df,
        },
        {
          attr: t('Attack'),
          value: game_base_unit?.ak,
        },
        {
          attr: t('dodge'),
          value: game_base_unit?.dodge,
        },
        {
          attr: t('hit'),
          value: game_base_unit?.hit,
        },
        {
          attr: t('Burst'),
          value: game_base_unit?.crit,
        },
        {
          attr: t('speed'),
          value: game_base_unit?.speed,
        },
        {
          attr: t('area'),
          value: game_base_unit?.ak_range_max,
        },
      ],
    }),
  );

  // React.useEffect(() => {
  //   radarChart.updateDate(armsAttr);
  //   console.log(armsAttr);
  // }, [armsAttr, radarChart]);

  const ref = React.useRef<HTMLDivElement>(null);

  const getSoldierSrc = React.useCallback(() => {
    let img = '';
    if (game_base_unit?.race) {
      img = getSpriteRes(game_base_unit?.race, game_base_unit?.index, 2);
    }
    return img;
  }, [game_base_unit]);

  React.useEffect(() => {
    if (ref.current) {
      ref.current.appendChild(radarChart.canvas);
    }
  }, [ref, radarChart]);

  const [visible, setVisible] = React.useState(true);
  const [gameMock, setGameMock] = React.useState({});
  const { getSimulation } = useSimulation();

  const getGameSimulation = React.useCallback(
    async (from: number) => {
      const res = await getSimulation(from);
      setGameMock(res);
    },
    [getSimulation],
  );

  const getArms = React.useCallback(() => {
    const arms = raceData[game_base_unit?.race]?.children?.find(
      ({ id }) => id === Number(game_base_unit?.unique_id),
    );
    return arms;
  }, [game_base_unit]);

  React.useEffect(() => {
    if (sid) {
      getGameSimulation(sid);
    }
  }, [sid, getGameSimulation]);

  return (
    <Container {...props}>
      <Content>
        <Head>
          <Flex alignItems='center'>
            <Text bold shadow='primary' fontSize='22px'>
              {getArms()?.name}
            </Text>
            <Text ml='25px'>Lv {game_base_unit?.level}</Text>
          </Flex>
          <Flex flex={1} justifyContent='flex-end' alignItems='flex-end'>
            {removeHandle && (
              <Button
                onClick={removeHandle}
                width={40}
                height={40}
                padding='0'
                variant='text'
              >
                <Image
                  width={40}
                  height={40}
                  src='/images/commons/icon/delete.png'
                />
              </Button>
            )}
          </Flex>
        </Head>
        <Body>
          <Preview
            onClick={() => {
              setVisible(!visible);
            }}
            isRadius
            stripe
            width='180px'
            height='180px'
          >
            <PreviewNumber>{armsData.count}</PreviewNumber>
            <Image src={getSoldierSrc()} width={180} height={180} />
          </Preview>
          <Flex flexDirection='column' ml='16px' flex={1}>
            <Flex alignItems='center' justifyContent='space-between' mb='5px'>
              <Text
                color={RaceTypeColor[game_base_unit?.race]}
                mb='2px'
                fontSize='22px'
                bold
              >
                {game_base_unit?.race ? t(`race-${game_base_unit?.race}`) : ''}
              </Text>
              {/* <Text ml='17px' /> */}
              <Flex>
                <Text>{t('Power')}</Text>
                <MarkText bold fontSize='20px' fontStyle='normal' ml='22px'>
                  {game_base_unit?.power}
                </MarkText>
              </Flex>
            </Flex>
            <Flex flex={1} alignItems='space-between' flexDirection='column'>
              <Group>
                <GroupInfo>
                  <Text color='textSubtle'>HP</Text>
                  <Text ml='10px'>{game_base_unit?.hp}</Text>
                </GroupInfo>
                <GroupInfo>
                  <Text color='textSubtle'>{t('Defense')}</Text>
                  <Text ml='10px'>{game_base_unit?.df}</Text>
                </GroupInfo>
                <GroupInfo>
                  <Text color='textSubtle'>{t('Attack')}</Text>
                  <Text ml='10px'>{game_base_unit?.ak}</Text>
                </GroupInfo>
              </Group>
              <Group>
                <GroupInfo>
                  <Text color='textSubtle'>{t('dodge')}</Text>
                  <Text ml='10px'>{game_base_unit?.dodge}%</Text>
                </GroupInfo>
                <GroupInfo>
                  <Text color='textSubtle'>{t('hit')}</Text>
                  <Text ml='10px'>{game_base_unit?.hit}%</Text>
                </GroupInfo>
                <GroupInfo>
                  <Text color='textSubtle'>{t('Burst')}</Text>
                  <Text ml='10px'>{game_base_unit?.crit}%</Text>
                </GroupInfo>
              </Group>
              <Group>
                <GroupInfo>
                  <Text color='textSubtle'>{t('firstMove')}</Text>
                  <Text ml='10px'>{game_base_unit?.speed}</Text>
                </GroupInfo>
                <GroupInfo>
                  <Text color='textSubtle'>{t('area')}</Text>
                  <Text ml='10px'>{`${game_base_unit?.ak_range_min}-${game_base_unit?.ak_range_max}`}</Text>
                </GroupInfo>
              </Group>
            </Flex>
          </Flex>
        </Body>
        <Flex>
          <Box ref={ref} width={180} />
          <Box ml='17px' mt='10px'>
            {/* <MarkText bold fontSize='18px' mb='20px' fontStyle='normal'>
              {t('Ability rating', { value: 'SS' })}
            </MarkText> */}
            <GraphicsCard stripe width='490px' height='110px'>
              <Text color='textSubtle'>{getArms()?.desc}</Text>
            </GraphicsCard>
          </Box>
        </Flex>
      </Content>
      <MiniRaceAni top='0' left='0' mock={gameMock} show={visible && !!sid} />
    </Container>
  );
};
