import React, { useRef, useEffect, useState, useCallback } from 'react';
import Game from 'game/core/Game';
import PreSoldier from 'game/core/PreSoldier';
import { Box, BoxProps } from 'uikit';

interface PreviewSoldierProps extends BoxProps {
  game?: Game;
  src?: string;
  sid: number;
}

const PreviewSoldier: React.FC<PreviewSoldierProps> = ({
  src = '/assets/flowerTop.png',
  sid,
  game,
  ...props
}) => {
  const [preSoldier] = useState(new PreSoldier(src, sid));

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.appendChild(preSoldier.app?.view);
    }
  }, [ref, preSoldier]);

  const dragStartHandle = useCallback(
    (event: any) => {
      game?.addDragPreSoldier(event.detail.soldier);
    },
    [game],
  );

  const dragEndHandle = useCallback(
    event => {
      game?.offDragPreSoldier();
    },
    [game],
  );

  useEffect(() => {
    if (game) {
      preSoldier.addEventListener('pointerdown', dragStartHandle);
      preSoldier.addEventListener('pointerup', dragEndHandle);
      preSoldier.addEventListener('pointerupoutside', dragEndHandle);
      return () => {
        preSoldier.removeEventListener('pointerdown', dragStartHandle);
        preSoldier.removeEventListener('pointerup', dragEndHandle);
        preSoldier.removeEventListener('pointerupoutside', dragEndHandle);
      };
    }
    return undefined;
  }, [game, preSoldier, dragStartHandle, dragEndHandle]);

  return <Box width={122} height={122} ref={ref} {...props} />;
};

export default PreviewSoldier;
