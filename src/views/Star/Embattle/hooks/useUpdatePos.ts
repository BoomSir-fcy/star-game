import Soldier from 'game/core/Soldier';
import { Api } from 'apis';
import Game from 'game/core/Game';
import { useToast } from 'contexts/ToastsContext';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'contexts/Localization';
import { useDispatch } from 'react-redux';
import {
  fetchGamePlanetUnitsAsync,
  fetchUnitListAsync,
  setEmptyUnits,
} from 'state/game/reducer';
import { SortSoldier } from '../components/SortBoard';

const useUpdatePos = (planetId: number, game: Game) => {
  const [gameSoldiers, setGameSoldiers] = useState<SortSoldier[]>([]);

  const { toastSuccess, toastError } = useToast();
  const { t } = useTranslation();
  const dispatch = useDispatch();

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

  const OneClickDeployment = useCallback(
    async (race: number) => {
      try {
        const res = await Api.GameApi.gameUnitSettingFast({
          planet_id: planetId,
        });
        if (Api.isSuccess(res)) {
          game.clearSoldier();
          dispatch(setEmptyUnits({}));

          dispatch(fetchUnitListAsync(race, planetId));
          dispatch(fetchGamePlanetUnitsAsync(planetId));

          toastSuccess(t('Deploy Succeeded'));
        }
      } catch (error) {
        console.log(error);
      }
    },
    [t, planetId, toastSuccess, dispatch, game],
  );

  const handleUpdate = useCallback(
    async (noToast?: boolean) => {
      const { soldiers } = game;
      if (soldiers.length < 6) {
        toastError(t('The board must be filled with 6 soldiers to save'));
        return;
      }
      // const { soldiers } = event.detail as { soldiers: Soldier[] };
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
        // setSortSoldiers(game.soldiers);
        if (!noToast) {
          toastSuccess(t('Deploy Succeeded'));
        }
      } else {
        // game.removeSoldier(game.soldiers[game.soldiers.length - 1]);
      }
    },
    [planetId, game, t, toastSuccess, toastError],
  );

  const onUpdate = useCallback(
    async (event: any) => {
      // const { soldiers } = game;
      const { soldiers } = event.detail as { soldiers: Soldier[] };
      setSortSoldiers(soldiers);
      // handleUpdate();
    },
    [setSortSoldiers],
  );

  useEffect(() => {
    game.addEventListener('updateSoldierPosition', onUpdate);
    return () => {
      game.removeEventListener('updateSoldierPosition', onUpdate);
    };
  }, [onUpdate, game]);

  return {
    gameSoldiers,
    setSortSoldiers,
    handleUpdate,
    OneClickDeployment,
  };
};

export default useUpdatePos;
