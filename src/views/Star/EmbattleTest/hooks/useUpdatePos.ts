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
      const soldiers1 = soldiers.filter(item => !item.isEnemy);
      const soldiers2 = soldiers.filter(item => item.isEnemy);
      const units1 = soldiers1.map((item, index) => {
        return {
          pos: {
            x: item?.axisPoint?.chequer?.axisX || 0,
            y: item?.axisPoint?.chequer?.axisY || 0,
          },
          speed: index, // 出手顺序
          unit_id: item.id,
        };
      });

      const units2 = soldiers2.map((item, index) => {
        return {
          pos: {
            x: item?.axisPoint?.chequer?.axisX || 0,
            y: item?.axisPoint?.chequer?.axisY || 0,
          },
          speed: index, // 出手顺序
          unit_id: item.id,
        };
      });

      const res = await Api.GameApi.testInit({
        units1,
        units2,
        tag: `t-${planetId}`,
      });
      setSortSoldiers(game.soldiers);
      console.log(res);
    },
    [planetId, setSortSoldiers, game.soldiers],
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
