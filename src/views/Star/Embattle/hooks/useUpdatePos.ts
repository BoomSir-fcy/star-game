import Soldier from 'game/core/Soldier';
import { Api } from 'apis';
import Game from 'game/core/Game';
import { useCallback, useEffect, useState } from 'react';
import { SortSoldier } from '../components/SortBoard';

const useUpdatePos = (planetId: number, game: Game) => {
  const [gameSoldiers, setGameSoldiers] = useState<SortSoldier[]>([]);

  const setSortSoldiers = useCallback(
    soldiers => {
      const newSoldiers = soldiers.map((soldier: Soldier, index: number) => {
        return {
          id: `${soldier.axisPoint?.chequer.axisX}${soldier.axisPoint?.chequer.axisY}`,
          src: soldier.textureRes,
          soldier,
        };
      });
      if (newSoldiers) {
        setGameSoldiers(newSoldiers);
      }
    },
    [setGameSoldiers],
  );

  const handleUpdate = useCallback(
    async (event: any) => {
      const { soldiers } = event.detail as { soldiers: Soldier[] };
      const MAX = 64;
      const units = soldiers.map((item, index) => {
        return {
          pos: {
            x: item?.axisPoint?.chequer?.axisX || 0,
            y: item?.axisPoint?.chequer?.axisY || 0,
          },
          speed: item?.options?.unitInfo?.speed, // 出手顺序
          unit_number: item?.options?.unitInfo?.number, // 兵种标识
          attribution_building: item?.options?.unitInfo?.build_id, // 培养皿id 建筑id
          unit_id: item.id,
        };
      });

      const res = await Api.GameApi.gameUnitSetting({
        units,
        planet_id: planetId,
      });
      if (Api.isSuccess(res)) {
        setSortSoldiers(game.soldiers);
      } else {
        game.removeSoldier(game.soldiers[game.soldiers.length - 1]);
      }
    },
    [planetId, game, setSortSoldiers],
  );

  useEffect(() => {
    game.addEventListener('updateSoldierPosition', handleUpdate);
    return () => {
      game.removeEventListener('updateSoldierPosition', handleUpdate);
    };
  }, [handleUpdate, game]);

  return {
    gameSoldiers,
    setSortSoldiers,
  };
};

export default useUpdatePos;
