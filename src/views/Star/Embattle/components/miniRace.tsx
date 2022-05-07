import React, { useCallback } from 'react';
import styled from 'styled-components';
import { Box } from 'uikit';
import useGame from 'game/hooks/useGame';
import { MapBaseUnits } from 'game/types';

import Running, { RoundsProps } from 'game/core/Running';

const Container = styled(Box)`
  position: absolute;
  border: 4px solid #f9feff;
  box-shadow: 0px 0px 10px 2px #41b7ff;
  background-color: #161920;
  width: 208px;
  height: 208px;
  top: 0;
  transition: 0.3s all;
  transform: translateX(-215px);
`;

const GridWidth = 200;
const GridHeight = 200;

const MiniRaceAni: React.FC<{
  mock: any;
}> = ({ mock }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const game = useGame({
    width: GridWidth,
    height: GridHeight,
    enableDrag: false,
  });

  const createSoldiers = React.useCallback(
    (
      poses: Api.Game.UnitPlanetPos[],
      base: MapBaseUnits,
      ids: { [xy: string]: string },
      isEnemy: boolean,
    ) => {
      poses?.forEach(item => {
        game.createSoldier(item.pos.x, item.pos.y, {
          srcId: `${item.base_unit_id}`,
          race: base[item.base_unit_id]?.race || 1,
          id: item.base_unit_id,
          sid: ids[`${item.pos.x}${item.pos.y}`],
          hp: base[item.base_unit_id]?.hp,
          isEnemy,
          enableDrag: false,
          unique_id: item.base_unit_id,
          // attackId: base[item.base_unit_id].unique_id
        });
      });
    },
    [game],
  );

  const runGame = useCallback(
    (slot: RoundsProps) => {
      const run = new Running(game, slot);
      run.play();
    },
    [game],
  );

  const initSoldiers = React.useCallback(
    soldier => {
      const ids: { [xy: string]: string } = {};

      if (soldier?.init) {
        Object.keys(soldier?.init?.ids).forEach(id => {
          const { x, y } = soldier?.init?.ids[id];
          ids[`${x}${y}`] = id;
        });
        createSoldiers(
          soldier.init.blue_units,
          soldier.init.base_unit,
          ids,
          false,
        );
        createSoldiers(
          soldier.init.red_units,
          soldier.init.base_unit,
          ids,
          true,
        );
        runGame({ round: soldier.slot });
      }
    },
    [createSoldiers, runGame],
  );

  const getCenterByAxis = useCallback(
    (x: number, y: number) => {
      const axis = game.getAxis(x, y);
      if (axis) {
        game.boards.setPosiotion(-axis.x - 30, -axis.y + 60);
      }
    },
    [game],
  );

  React.useEffect(() => {
    if (ref.current) {
      ref.current.appendChild(game.view);
      game.creatTerrain();
      initSoldiers(mock);
      getCenterByAxis(
        mock?.init?.blue_units[0].pos.x,
        mock?.init?.blue_units[0].pos.y,
      );
    }
  }, [ref, initSoldiers, game, getCenterByAxis, mock]);

  React.useEffect(() => {
    return () => {
      game.clearSoldier();
    };
  });

  return (
    <Container>
      <Box ref={ref} />
    </Container>
  );
};

export default MiniRaceAni;
