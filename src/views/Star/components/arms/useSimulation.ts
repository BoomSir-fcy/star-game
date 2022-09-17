import React from 'react';
import Soldier from 'game/core/Soldier';
import { Api } from 'apis';

const useSimulation = () => {
  // 保存模拟人物数据
  const setSimulation = React.useCallback(async (data: any) => {
    const MAX = 64;
    const soldiers: Soldier[] = (data ?? []).map((r: any) => r.soldier);
    const temp = soldiers.map((item, index) => {
      return {
        ...item,
        speed: MAX - index, // 出手顺序
      };
    });

    const soldiers1 = temp.filter(item => !item.isEnemy);
    const soldiers2 = temp.filter(item => item.isEnemy);
    const from = soldiers1.map(item => {
      return {
        pos: {
          x: item?.axisPoint?.chequer?.axisX || 0,
          y: item?.axisPoint?.chequer?.axisY || 0,
        },
        speed: item.speed, // 出手顺序
        unit_id: item.id,
        unit_number: item.options?.unitInfo?.number,
      };
    });

    const to = soldiers2.map(item => {
      return {
        pos: {
          x: item?.axisPoint?.chequer?.axisX || 0,
          y: item?.axisPoint?.chequer?.axisY || 0,
        },
        speed: item.speed, // 出手顺序
        unit_id: item.id,
        unit_number: item.options?.unitInfo?.number,
      };
    });
    const { race } = soldiers?.[0]?.options || {};
    await Api.GameApi.Gamemock({ from, to, race });
  }, []);

  // 获取模拟人物数据
  const getSimulation = React.useCallback(async (from: number) => {
    try {
      const res = await Api.GameApi.GamemockDetail(from);
      if (Api.isSuccess(res)) {
        return res?.data?.data;
      }
      return {};
    } catch (error) {
      throw new Error('');
    }
  }, []);

  return {
    setSimulation,
    getSimulation,
  };
};

export default useSimulation;
