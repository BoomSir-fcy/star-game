import config from 'game/config';
import { getAddActiveSoliderEvent } from 'game/core/event';
import Game from 'game/core/Game';
import Soldier from 'game/core/Soldier';
import { getSpriteName, getSpriteRes } from 'game/core/utils';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useStore } from 'state';
import {
  Box,
  Text,
  GraphicsCard,
  Flex,
  BorderCard,
  GraphicsCardProps,
  Image,
  MarkText,
} from 'uikit';
import orderBy from 'lodash/orderBy';
import { useToast } from 'contexts/ToastsContext';
import { useTranslation } from 'contexts/Localization';
import { isApp } from 'utils/client';
import PreviewSoldier from './PreviewSoldier';
import { SortSoldier } from './SortBoard';
import { PlayBtn } from './styled';

interface PreviewListProps extends GraphicsCardProps {
  game: Game;
  gameSoldiers: SortSoldier[];
  activeSoldier: Soldier | null;
  race?: Api.Game.race;
  disableClick?: boolean;
  disableDrag?: boolean;
  onDrag: () => void;
}
const PreviewList: React.FC<PreviewListProps> = ({
  activeSoldier,
  game,
  race = 1,
  disableDrag,
  disableClick,
  gameSoldiers,
  onDrag,
  ...props
}) => {
  const units = useStore(p => p.game.baseUnits);
  const [disableDragSoilder, setdDisableDragSoilder] = useState(disableDrag);
  const [visibleBtn, setVisibleBtn] = useState(false);
  const { t } = useTranslation();

  const { toastError } = useToast();

  const activeNum = useCallback(
    id => {
      return gameSoldiers.filter(item => item.soldier.id === id)?.length || 0;
    },
    [gameSoldiers],
  );

  const UseSoldierNum = useCallback(
    (item: Api.Game.UnitInfo, add?: boolean) => {
      return `${
        add ? activeNum(item.unique_id) + 1 : activeNum(item.unique_id)
      }/${item.default_unit ? '6' : item.count}`;
    },
    [activeNum],
  );

  useEffect(() => {
    setdDisableDragSoilder(isApp() || disableDrag);
  }, [disableDrag]);

  const unitMaps = useMemo(() => {
    if (units[race]) return units[race];
    return {};
  }, [units, race]);

  const isBaseUnit = (item: Api.Game.UnitInfo) => {
    return item.default_unit;
    // return item.default_unit;
  };

  const list = useMemo(() => {
    return orderBy(
      Object.values(unitMaps),
      item => (isBaseUnit(item) ? 99999 : item.count),
      'desc',
    );
  }, [unitMaps]);

  useEffect(() => {
    if (list.length) {
      const [item] = list;

      const soldier = new Soldier({
        x: 0,
        y: 0,
        srcId: `${item?.index}`,
        race,
        id: item?.unique_id,
        unique_id: item?.unique_id,
        unitInfo: { ...unitMaps?.[item?.unique_id], hp: 0 },
        activeCountText: UseSoldierNum(unitMaps?.[item?.unique_id]),
      });
      game.addActiveSolider(soldier);
    }
  }, [list, game, race, unitMaps, UseSoldierNum]);

  const [moving, setMoving] = useState(false);

  const dragEndHandle = useCallback(
    (event: PointerEvent) => {
      event.preventDefault();
      if (moving) {
        setMoving(false);
        game?.offDragPreSoldier();
      }
    },
    [game, moving, setMoving],
  );

  const dragStartHandle = useCallback(
    (event: React.PointerEvent<HTMLDivElement>, item: Api.Game.UnitInfo) => {
      event.preventDefault();
      const soldier = new Soldier({
        x: 0,
        y: 0,
        srcId: `${item.index}`,
        race,
        enableDrag: false,
        id: item.unique_id,
        unique_id: item.unique_id,
        unitInfo: { ...item, hp: 0 },
        activeCountText: UseSoldierNum(item, true),
      });
      setMoving(true);
      game?.addDragPreSoldier(soldier);
    },
    [game, race, UseSoldierNum],
  );

  const checkCreateSoldier = useCallback(
    (item: Api.Game.UnitInfo) => {
      if (gameSoldiers.length >= config.MAX_SOLDIER_COUNT) {
        toastError(t('http-error-1000004'));
        return false;
      }
      if (activeNum(item.unique_id) >= item.count && !isBaseUnit(item)) {
        return false;
      }
      return true;
    },
    [gameSoldiers.length, toastError, t, activeNum],
  );

  // 上阵
  const handleGoIntoBattle = (item: Api.Game.UnitInfo) => {
    if (!checkCreateSoldier(item)) return;
    const options = {
      race,
      srcId: `${item.index}`,
      enableDrag: true,
      id: item.unique_id,
      unique_id: item.unique_id,
      unitInfo: { ...item, hp: 0 },
      activeCountText: UseSoldierNum(item, true),
    };
    game.addDragPreSoldierApp(options);
  };

  useEffect(() => {
    window.addEventListener('pointerup', dragEndHandle);
    return () => {
      window.removeEventListener('pointerup', dragEndHandle);
    };
  }, [dragEndHandle]);

  const getSoldierSrc = useCallback((item: Api.Game.UnitInfo) => {
    return getSpriteRes(item.race, item.index.toString(), 2);
  }, []);

  const getSoldierName = useCallback((item: Api.Game.UnitInfo) => {
    return getSpriteName(item.race, item.index.toString()) || item.tag;
  }, []);

  return (
    <GraphicsCard width='627px' height='230px' padding='0 16px' {...props}>
      <Flex
        className='star-embattle-step1'
        style={{ overflow: 'auto' }}
        width='100%'
      >
        {list.map((item, index) => {
          return (
            <Box
              className={index === 0 ? 'star-embattle-step2' : ''}
              style={{
                cursor: 'pointer',
              }}
              key={`${item.unique_id}_${item.level}`}
              margin='20px 20px 0'
              position='relative'
            >
              {/* {visibleBtn && activeSoldier?.unique_id === item.unique_id ? (
                <PlayBtn scale='xs' onClick={() => handleGoIntoBattle(item)}>
                  上阵
                </PlayBtn>
              ) : null} */}
              <BorderCard
                isActive={activeSoldier?.unique_id === item.unique_id}
                width={122}
                height={122}
                borderWidth={2}
                borderRadius='10px'
                position='relative'
                onClick={() => {
                  if (!disableClick) {
                    // if (!checkCreateSoldier(item)) return;
                    const soldier = new Soldier({
                      x: 0,
                      y: 0,
                      srcId: `${item.index}`,
                      race,
                      id: item.unique_id,
                      unique_id: item.unique_id,
                      unitInfo: { ...unitMaps?.[item.unique_id], hp: 0 },
                      activeCountText: UseSoldierNum(item, true),
                    });
                    game.addActiveSolider(soldier);
                    // if (isApp()) {
                    //   setVisibleBtn(true);
                    // }
                  }
                  // game.dispatchEvent(getAddActiveSoliderEvent(soldier));
                }}
              >
                <Flex
                  position='relative'
                  zIndex={2}
                  justifyContent='space-between'
                >
                  <Text shadow='primary' fontSize='22' ml='13px' mt='2px' bold>
                    LV {item.level}
                  </Text>
                  <Text shadow='primary' fontSize='22' mr='13px' mt='2px' bold>
                    {/* {activeNum(item.unique_id)}/
                    {isBaseUnit(item) ? '6' : item.count} */}
                    {UseSoldierNum(item)}
                  </Text>
                </Flex>
                <PreviewSoldier
                  src={getSoldierSrc(item)}
                  game={game}
                  position='absolute'
                  top='0'
                  left='0'
                  sid={item.unique_id}
                  customDrag
                  disableDrag={disableDragSoilder}
                  onPointerDown={e => {
                    if (!checkCreateSoldier(item)) return;

                    if (!disableDragSoilder) {
                      onDrag();
                      dragStartHandle(e, item);
                    }
                  }}
                />
                <Box
                  width={36}
                  height={36}
                  position='absolute'
                  left='0'
                  bottom='0'
                >
                  <Image
                    style={{ cursor: 'pointer' }}
                    // position='absolute'
                    // bottom='0'
                    // left='0'
                    width={36}
                    height={36}
                    src='/images/commons/icon/add.png'
                    onClick={() => {
                      handleGoIntoBattle(item);
                    }}
                  />
                </Box>
              </BorderCard>
              <Text mt='8px' textAlign='center' bold>
                {getSoldierName(item)}
              </Text>
              <Flex justifyContent='center'>
                <Text bold>{t('Power')}</Text>{' '}
                <MarkText fontStyle='normal' bold>
                  {item?.power}
                </MarkText>
              </Flex>
            </Box>
          );
        })}
      </Flex>
    </GraphicsCard>
  );
};

export default React.memo(PreviewList);
