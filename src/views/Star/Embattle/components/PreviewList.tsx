import config from 'game/config';
import { getAddActiveSoliderEvent } from 'game/core/event';
import Game from 'game/core/Game';
import Soldier from 'game/core/Soldier';
import { getSpriteName, getSpriteRes } from 'game/core/utils';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useStore } from 'state';
import { Box, Text, BgCard, Flex, BorderCard, BgCardProps } from 'uikit';
import { useToast } from 'contexts/ToastsContext';
import { isApp } from 'utils/client';
import PreviewSoldier from './PreviewSoldier';
import { SortSoldier } from './SortBoard';
import { PlayBtn } from './styled';

interface PreviewListProps extends BgCardProps {
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

  const { toastError } = useToast();

  useEffect(() => {
    setdDisableDragSoilder(isApp() || disableDrag);
  }, [disableDrag]);

  const unitMaps = useMemo(() => {
    if (units[race]) return units[race];
    return {};
  }, [units, race]);

  const list = useMemo(() => {
    return Object.values(unitMaps);
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
        unitInfo: unitMaps?.[item?.unique_id],
      });
      game.addActiveSolider(soldier);
    }
  }, [list, game, race, unitMaps]);

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
        unitInfo: item,
      });
      setMoving(true);
      game?.addDragPreSoldier(soldier);
    },
    [game, race],
  );

  const checkCreateSoldier = useCallback(() => {
    if (gameSoldiers.length >= config.MAX_SOLDIER_COUNT) {
      toastError('当前放置数量已达到最大');
      return false;
    }
    return true;
  }, [gameSoldiers.length, toastError]);

  // 上阵
  const handleGoIntoBattle = (item: Api.Game.UnitInfo) => {
    if (!checkCreateSoldier()) return;
    const options = {
      race,
      srcId: `${item.index}`,
      enableDrag: true,
      id: item.unique_id,
      unique_id: item.unique_id,
      unitInfo: item,
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
    return getSpriteName(item.race, item.unique_id.toString()) || item.tag;
  }, []);

  return (
    <BgCard padding='0 28px' variant='long' {...props}>
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
              margin='49px 20px 0'
              position='relative'
            >
              {visibleBtn && activeSoldier?.unique_id === item.unique_id ? (
                <PlayBtn scale='xs' onClick={() => handleGoIntoBattle(item)}>
                  上阵
                </PlayBtn>
              ) : null}
              <BorderCard
                isActive={activeSoldier?.unique_id === item.unique_id}
                width={122}
                height={122}
                borderWidth={2}
                borderRadius='10px'
                position='relative'
                onClick={() => {
                  if (!disableClick) {
                    if (!checkCreateSoldier()) return;

                    const soldier = new Soldier({
                      x: 0,
                      y: 0,
                      srcId: `${item.index}`,
                      race,
                      id: item.unique_id,
                      unique_id: item.unique_id,
                      unitInfo: unitMaps?.[item.unique_id],
                    });
                    game.addActiveSolider(soldier);
                    if (isApp()) {
                      setVisibleBtn(true);
                    }
                  }
                  // game.dispatchEvent(getAddActiveSoliderEvent(soldier));
                }}
              >
                <Text shadow='primary' fontSize='22' ml='13px' mt='2px' bold>
                  LV {item.level}
                </Text>
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
                    if (!checkCreateSoldier()) return;

                    if (!disableDragSoilder) {
                      onDrag();
                      dragStartHandle(e, item);
                    }
                  }}
                />
              </BorderCard>
              <Text mt='8px' textAlign='center' fontSize='20' bold>
                {getSoldierName(item)}
              </Text>
            </Box>
          );
        })}
      </Flex>
    </BgCard>
  );
};

export default React.memo(PreviewList);
