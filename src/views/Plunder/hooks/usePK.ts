import Game from 'game/core/Game';
import Running from 'game/core/Running';
import Soldier from 'game/core/Soldier';
import { useCallback, useState } from 'react';
import { GamePkInfo, MapBaseUnits } from 'state/types';

type idMap = { [xy: string]: string };

type SoldierEvent = CustomEvent<any>;

export const usePK = (game: Game) => {
  const [running, setRunning] = useState<Running | null>(null);

  const createSoldiers = useCallback(
    (
      poses: Api.Game.UnitPlanetPos[],
      base: MapBaseUnits,
      ids: idMap,
      isEnemy: boolean,
    ) => {
      let soldier: Soldier | null = null;
      poses?.forEach(item => {
        soldier = game.createSoldier(item.pos.x, item.pos.y, {
          srcId: `${item.base_unit_id}`,
          race: base[item.base_unit_id]?.race || 1,
          id: item.base_unit_id,
          sid: ids[`${item.pos.x}${item.pos.y}`],
          hp: base[item.base_unit_id]?.hp,
          isEnemy,
          enableDrag: false,
          unique_id: item.base_unit_id,
        });
      });
      return soldier;
    },
    [game],
  );

  const initHandle = useCallback(
    (PKInfo: GamePkInfo) => {
      const ids: idMap = {};
      Object.keys(PKInfo?.init?.ids).forEach(id => {
        const { x, y } = PKInfo.init.ids[id];
        ids[`${x}${y}`] = id;
      });

      createSoldiers(PKInfo.init.blue_units, PKInfo.init.base_unit, ids, false);
      createSoldiers(PKInfo.init.red_units, PKInfo.init.base_unit, ids, true);
      game.once('lastSoldierCreated', (event: Event) => {
        console.log('lastSoldierCreated');
        const _running = new Running(game, PKInfo.slot);
        setRunning(_running);
        _running.play();
      });
    },
    [game, createSoldiers],
  );

  return {
    initHandle,
    running,
  };
};
