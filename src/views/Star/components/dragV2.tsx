import React from 'react';
import useGame from 'game/hooks/useGame';
import { Box } from 'uikit';

export const DragV2: React.FC<{
  rows: number;
  cols: number;
}> = ({ rows, cols }) => {
  const game = useGame({ width: 1600, offsetStartX: 0 });
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    game.creatTerrain();
  }, [game]);

  React.useEffect(() => {
    if (ref.current) {
      ref.current.appendChild(game.view);
    }

    console.log(!!ref.current);
  }, [ref, game]);

  return (
    <Box>
      <Box ref={ref} />
    </Box>
  );
};
