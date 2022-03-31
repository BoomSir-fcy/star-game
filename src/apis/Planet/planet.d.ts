declare namespace Api {
  namespace Planet {
    // 我的星球分页参数
    interface PageParams {
      page: number;
      page_size: number;
    }

    // 星球信息
    interface PlanetInfo {
      id: number;
      name: string; // 星球名
      owner: string; // 当前所有人
      oldOwner: string; // 上一个所有人
      rarity: number; // 品质1-6
      level: number; // 等级 从1开始
      strengthenLevel: number; // 强化等级
      working: boolean; // 是否工作 1工作
      workTime: number; // 工作开始时间
      areaX: number; // x轴方向上的个数
      areaY: number; // y轴方向上的格数
      oreYield: number; // 矿石每秒产出
      oreConsumption: number; // 矿石每秒总消耗
      energyYield: number; // 能量每秒产出
      energyConsumption: number; // 能量每秒总消耗
      populationYield: number; // 人口每秒产出
      populationConsumption: number; // 人口每秒消耗
      settleAt: number; // 最后一次结算时间
      addTime: number; // 添加时间
      update_finish_time: number; // 升级结束时间
      strengthen_finish_time: number; // 强化结束时间
      build_count: number; // 建筑数量
      energy: number; // 能量
      population: number; // 人口
      plunder_speed: number; // 掠夺速度
      race: number; // 种族  1-神族 2-人族 3-虫族
      stone: number; // 矿石
      extra: ExtraInfo;
    }

    interface ExtraInfo {
      defense: number; // 防御加成
      attack: number; // 攻击加成
      hp: number; // hp加成
      product: number; // 产能加成
      build: number; // 建筑成本
    }
  }
}
