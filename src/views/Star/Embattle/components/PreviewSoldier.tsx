import React, { useRef, useEffect, useState, useCallback } from 'react';
import Boards from 'game/core/Boards';
import PreSoldier from 'game/core/PreSoldier';
import { Box, BoxProps } from 'uikit';

interface PreviewSoldierProps extends BoxProps {
  boards: Boards;
  src?: string;
}

const PreviewSoldier: React.FC<PreviewSoldierProps> = ({
  src = '/assets/flowerTop.png',
  boards,
  ...props
}) => {
  const [preSoldier] = useState(new PreSoldier(src));

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.appendChild(preSoldier.app?.view);
    }
  }, [ref, preSoldier]);

  const dragStartHandle = useCallback(
    (event: any) => {
      boards.addDragPreSoldier(event.detail.soldier);
    },
    [boards],
  );

  const dragEndHandle = useCallback(
    event => {
      boards.offDragPreSoldier();
    },
    [boards],
  );

  useEffect(() => {
    preSoldier.addEventListener('pointerdown', dragStartHandle);
    preSoldier.addEventListener('pointerup', dragEndHandle);
    preSoldier.addEventListener('pointerupoutside', dragEndHandle);
    return () => {
      preSoldier.removeEventListener('pointerdown', dragStartHandle);
      preSoldier.removeEventListener('pointerup', dragEndHandle);
      preSoldier.removeEventListener('pointerupoutside', dragEndHandle);
    };
  }, [preSoldier, dragStartHandle, dragEndHandle]);

  return <Box width={122} height={122} ref={ref} {...props} />;
};

export default PreviewSoldier;
