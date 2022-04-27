import React, { useCallback } from 'react';
import styled from 'styled-components';
import { Box } from 'uikit';
import { MapBaseUnits } from 'state/types';
import { Point } from '@pixi/math';

import config from 'game/config';
import Game from 'game/core/Game';
import RunSimulation, { RoundsProps } from 'game/core/RunSimulation';
import useGame from 'game/hooks/useGame';

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

// 种族动画预览
// const game = new Game({
//   width: 200,
//   height: 200,
//   test: true,
//   enableDrag: false,
// });
const MiniRaceAni: React.FC<{
  mock: any;
}> = ({ mock }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const game = useGame({
    width: 200,
    height: 200,
    test: true,
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
      const run = new RunSimulation(game, slot);
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
        runGame(soldier.slot);
      }
    },
    [createSoldiers, runGame],
  );

  const getCenter = (x: number, y: number, width: number, height: number) => {
    return {
      x: ((x * 100) / 2 - width) / 2,
      y: ((y * 125) / 2 - height) / 2,
    };
  };

  React.useEffect(() => {
    if (ref.current) {
      ref.current.appendChild(game.view);
      game.creatTerrain();

      // 通过x,y计算坐标中心点
      // const center = getCenter(
      //   mock?.init?.blue_units[0].pos.x + 8,
      //   mock?.init?.blue_units[0].pos.y + 8,
      //   200,
      //   200,
      // );

      // console.log(mock?.init?.blue_units);
      // console.log(center);

      initSoldiers(mock);
    }
  }, [ref, mock, initSoldiers, game]);

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
