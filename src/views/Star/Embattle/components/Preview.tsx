import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from 'react';
import styled from 'styled-components';
import RadarChart from 'game/core/RadarChart';
import Soldier from 'game/core/Soldier';
import { eventsType, SoldierCustomEvent } from 'game/core/event';
import {
  getSkillKey,
  getSkillText,
  getSpriteRes,
  getSpriteName,
} from 'game/core/utils';
import { useStore } from 'state';
import { useTranslation } from 'contexts/Localization';
import Game from 'game/core/Game';
import {
  Box,
  Flex,
  Text,
  BoxProps,
  Image,
  BorderCard,
  BorderCardProps,
  Divider,
  Card,
  Button,
} from 'uikit';
import { raceData } from 'config/raceConfig';
import { Races } from 'uikit/theme/types';
import { Container } from './styled';

import PreviewSoldier from './PreviewSoldier';
import MiniRaceAni from './miniRace';

import useSimulation from '../hooks/useSimulation';

// transform: translateX(252px);
const BorderCardStyled = styled(BorderCard) <{ show?: boolean }>`
  transition: 0.3s all;
  transform: ${({ show }) => (show ? 'translateX(0)' : 'translateX(120%)')};
`;

const CanvasBox = styled(Box)`
  & > canvas {
    margin: auto;
    display: block;
  }
`;

interface PreviewProps extends BorderCardProps {
  game: Game;
  activeSoldier: Soldier | null;
}

interface StatusItemProps {
  label: string;
  value: number;
  src: string;
  subSrc?: string;
}
const StatusItem: React.FC<StatusItemProps> = ({
  label,
  value,
  src,
  subSrc,
}) => {
  return (
    <Flex margin='6px 0' alignItems='center' width='200px'>
      <Image width={60} height={60} src={src} />
      <Box>
        <Flex>
          <Text fontSize='20px' color='textTips'>
            {label}
          </Text>
          {subSrc && <Image width={30} height={30} src={subSrc} />}
        </Flex>
        <Text fontSize='22px'>
          {value} / {value}
        </Text>
      </Box>
    </Flex>
  );
};

const Preview: React.FC<PreviewProps> = ({ game, activeSoldier, ...props }) => {
  const { t } = useTranslation();
  const { arms_attr } = activeSoldier?.options?.unitInfo || {};

  const radarData = useMemo(() => {
    return [
      {
        attr: '生命',
        value: arms_attr?.hp || 0,
      },
      {
        attr: '攻击',
        value: arms_attr?.ak || 0,
      },
      {
        attr: '防御',
        value: arms_attr?.df || 0,
      },
      {
        attr: '命中',
        value: arms_attr?.hit || 0,
      },
      {
        attr: '暴击',
        value: arms_attr?.crit || 0,
      },
      {
        attr: '闪避',
        value: arms_attr?.miss || 0,
      },
      {
        attr: '范围',
        value: arms_attr?.range || 0,
      },
      {
        attr: '移动',
        value: arms_attr?.move || 0,
      },
    ];
  }, [arms_attr]);
  const [radarChart] = useState(
    new RadarChart({
      width: 180,
      height: 180,
      colorPolygon: '#FFFFFF',
      colorText: '#FFFFFF',
      fillColor: 'rgba(211, 95, 96, 0.5)',
      data: radarData,
    }),
  );

  useEffect(() => {
    radarChart.updateDate(radarData);
  }, [radarData, radarChart]);

  const [visible, setVisible] = useState(true);
  const [gameMock, setGameMock] = useState({});
  const ref = useRef<HTMLDivElement>(null);

  const { getSimulation } = useSimulation();

  useEffect(() => {
    if (ref.current) {
      ref.current.appendChild(radarChart.canvas);
    }
  }, [ref, radarChart]);

  const baseSkill = useStore(p => p.game.baseSkill);

  const removeHandle = useCallback(() => {
    if (activeSoldier) {
      game.removeSoldier(activeSoldier);
    }
  }, [activeSoldier, game]);

  const skillValue = useMemo(() => {
    const key = getSkillKey(activeSoldier?.options?.unitInfo?.skill);
    if (baseSkill[key]) {
      const value = baseSkill[key]?.find(
        item => item.skill_id === activeSoldier?.options?.unitInfo?.skill_id,
      )?.value;
      if (value) return `+${value}`;
    }
    return '+0';
  }, [
    activeSoldier?.options?.unitInfo?.skill,
    activeSoldier?.options?.unitInfo?.skill_id,
    baseSkill,
  ]);

  const getGameSimulation = React.useCallback(
    async (from: number) => {
      const res = await getSimulation(from);
      setGameMock(res);
    },
    [getSimulation],
  );

  React.useEffect(() => {
    // setVisible(false);
    if (activeSoldier) {
      getGameSimulation(activeSoldier?.id);
    }
  }, [activeSoldier, getGameSimulation]);

  const soldierDesc = useMemo(() => {
    let desc = '';
    if (activeSoldier?.race) {
      const list = raceData[activeSoldier.race as Races].children;
      desc =
        list.find(item => item.id === Number(activeSoldier.srcId))?.desc || '';
    }
    return desc;
  }, [activeSoldier]);

  const getSoldierSrc = useCallback(() => {
    let img = '';
    if (activeSoldier?.race) {
      img = getSpriteRes(activeSoldier.race, activeSoldier.srcId, 2);
    }
    return img;
  }, [activeSoldier]);

  const getSoldierName = useCallback(() => {
    let name = '';
    if (activeSoldier?.race) {
      name = getSpriteName(
        activeSoldier.race,
        activeSoldier.unique_id.toString(),
      );
    }
    return name || activeSoldier?.options?.unitInfo?.tag;
  }, [activeSoldier]);

  return (
    <Box style={{ position: 'relative' }} className='star-embattle-step4'>
      <Box
        // width='608px'
        // height='476px'
        pr='8px'
        position='relative'
        overflow='hidden'
        onClick={e => e.stopPropagation()}
        {...props}
      >
        <BorderCardStyled
          show={!!activeSoldier}
          isActive
          width='600px'
          height='476px'
        >
          <Flex
            mt='22px'
            padding='0 28px 0 36px'
            alignItems='center'
            justifyContent='space-between'
          >
            <Flex alignItems='center' flex={1}>
              <Text bold shadow='primary'>
                {getSoldierName()}
              </Text>
              <Text mt='2px' ml='36px' fontSize='22px'>
                LV {activeSoldier?.options?.unitInfo?.level}
              </Text>
              {/* <Button width={40} height={40} padding='0' variant='text'>
                <Image
                  width={40}
                  height={40}
                  src='/images/commons/icon/Mecha_upgrade.png'
                />
              </Button> */}
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
            </Flex>
            {/* <Image width={40} height={40} src='/images/commons/icon/help.png' /> */}
          </Flex>
          <Flex alignItems='center' padding='0 10px'>
            <PreviewSoldier
              src={getSoldierSrc()}
              style={{
                flexShrink: 0,
                marginRight: '10px',
                border: '1px solid #3F4147',
                boxShadow: '0px 7px 3px 0px rgba(0, 0, 0, 0.35)',
                cursor: 'pointer',
              }}
              onClick={() => setVisible(!visible)}
              sid={1}
            />
            <Flex flexWrap='wrap' justifyContent='space-between'>
              <StatusItem
                label={t('planetHPValue')}
                value={activeSoldier?.options?.unitInfo?.hp || 0}
                src='/images/commons/star/HP.png'
              // subSrc='/images/commons/icon/add_blood.png'
              />
              <StatusItem
                label={t('hit')}
                value={activeSoldier?.options?.unitInfo?.hit || 0}
                src='/images/commons/star/durability.png'
              />
              <StatusItem
                label={t('Defense')}
                value={activeSoldier?.options?.unitInfo?.df || 0}
                src='/images/commons/star/defense.png'
              />
              <StatusItem
                label={t('Attack')}
                value={activeSoldier?.options?.unitInfo?.ak || 0}
                src='/images/commons/star/attackValue.png'
              />
            </Flex>
          </Flex>
          <Divider margin='8px auto 22px' width={565} />
          <Flex>
            <CanvasBox ml='22px' ref={ref} width={238} />
            <Card overflow='auto' width={334} height={186} padding='16px'>
              {/* <Flex justifyContent='space-between'>
                <Text fontSize='20' color='textTips'>
                  {t('Attack distance')}
                </Text>
                {activeSoldier?.options?.unitInfo?.ak_range_min ===
                activeSoldier?.options?.unitInfo?.ak_range_max ? (
                  <Text fontSize='22'>{`${activeSoldier?.options?.unitInfo?.ak_range_min}`}</Text>
                ) : (
                  <Text fontSize='22'>{`${activeSoldier?.options?.unitInfo?.ak_range_min} ~ ${activeSoldier?.options?.unitInfo?.ak_range_max}`}</Text>
                )}
              </Flex>
              <Flex justifyContent='space-between'>
                <Text fontSize='20' color='textTips'>
                  {t('Moving distance')}
                </Text>
                {activeSoldier?.options?.unitInfo?.move_far && (
                  <Text fontSize='22'>
                    {activeSoldier?.options?.unitInfo?.move_far}
                  </Text>
                )}
              </Flex> */}
              <Text mt='16px' fontSize='20' color='textTips'>
                {soldierDesc}
              </Text>
            </Card>
          </Flex>
        </BorderCardStyled>
      </Box>
      {/* 种族动画预览 */}
      <MiniRaceAni mock={gameMock} show={visible && !!activeSoldier} />
    </Box>
  );
};

export default Preview;
