import { getAddActiveSoliderEvent } from 'game/core/event';
import Game from 'game/core/Game';
import Soldier from 'game/core/Soldier';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useStore } from 'state';
import { Box, Text, BgCard, Flex, BorderCard } from 'uikit';
import PreviewSoldier from './PreviewSoldier';

interface PreviewListProps {
  game: Game;
  activeSoldier: Soldier | null;
  race?: Api.Game.race;
}
const PreviewList: React.FC<PreviewListProps> = ({
  activeSoldier,
  game,
  race = 1,
}) => {
  const units = useStore(p => p.game.baseUnits);

  const unitMaps = useMemo(() => {
    if (units[race]) return units[race];
    return {};
  }, [units, race]);

  const list = useMemo(() => {
    return Object.values(unitMaps);
  }, [unitMaps]);

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
        srcId: `${item.unique_id}`,
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

  useEffect(() => {
    window.addEventListener('pointerup', dragEndHandle);
    return () => {
      window.removeEventListener('pointerup', dragEndHandle);
    };
  }, [dragEndHandle]);

  return (
    <BgCard padding='0 28px' variant='long'>
      <Flex
        className='star-embattle-step1'
        style={{ overflow: 'auto' }}
        width='100%'
      >
        {list.map(item => {
          return (
            <Box
              style={{
                cursor: 'pointer',
              }}
              key={item.unique_id}
              margin='49px 20px 0'
            >
              <BorderCard
                isActive={activeSoldier?.unique_id === item.unique_id}
                width={122}
                height={122}
                borderWidth={2}
                borderRadius='10px'
                position='relative'
                onClick={() => {
                  const soldier = new Soldier({
                    x: 0,
                    y: 0,
                    srcId: `${item.unique_id}`,
                    race,
                    id: item.unique_id,
                    unique_id: item.unique_id,
                    unitInfo: unitMaps?.[item.unique_id],
                  });
                  game.addActiveSolider(soldier);
                  // game.dispatchEvent(getAddActiveSoliderEvent(soldier));
                }}
              >
                <Text shadow='primary' fontSize='22' ml='13px' mt='2px' bold>
                  LV 1
                </Text>
                <PreviewSoldier
                  game={game}
                  position='absolute'
                  top='0'
                  left='0'
                  sid={item.unique_id}
                  customDrag
                  onPointerDown={e => dragStartHandle(e, item)}
                />
              </BorderCard>
              <Text mt='8px' textAlign='center' fontSize='20' bold>
                {item.tag}
              </Text>
            </Box>
          );
        })}
      </Flex>
    </BgCard>
  );
};

export default React.memo(PreviewList);
