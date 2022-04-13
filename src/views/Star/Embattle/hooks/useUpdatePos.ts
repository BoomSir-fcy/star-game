import Soldier from 'game/core/Soldier';
import { Api } from 'apis';
import Game from 'game/core/Game';
import { useCallback, useEffect, useState } from 'react';
import { SortSoldier } from '../components/SortBoard';

const useUpdatePos = (planetId: number, game: Game) => {
  const [gameSoldiers, setGameSoldiers] = useState<SortSoldier[]>([]);

  const setSortSoldiers = useCallback(
    soldiers => {
      const newSoldiers = soldiers?.map((soldier: Soldier, index: number) => {
        return {
          id: `${soldier.axisPoint?.chequer.axisX}${soldier.axisPoint?.chequer.axisY}`,
          src: soldier.options?.textureRes,
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
      const units = soldiers.map((item, index) => {
        return {
          pos: {
            x: item?.axisPoint?.chequer?.axisX || 0,
            y: item?.axisPoint?.chequer?.axisY || 0,
          },
          speed: index, // 出手顺序
          unit_id: item.id,
        };
      });

      const res = await Api.GameApi.gameUnitSetting({
        units,
        planet_id: planetId,
      });
      setSortSoldiers(game.soldiers);
      console.log(res);
    },
    [planetId, setSortSoldiers],
  );

  useEffect(() => {
    game.addEventListener('updateSoldierPosition', handleUpdate);
    return () => {
      game.removeEventListener('updateSoldierPosition', handleUpdate);
    };
  }, [handleUpdate]);

  return {
    gameSoldiers,
    setSortSoldiers,
  };
};

export default useUpdatePos;
