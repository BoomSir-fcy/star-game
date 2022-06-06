declare namespace Api {
  namespace Planet {
    // 我的星球分页参数
    interface PageParams {
      race?: number;
      token?: string;
      rarity?: number;
      page: number;
      page_size: number;
    }
    interface Strengthen {
      PlanetID: number;
    }
    interface StrengthenPost {
      planet_id: number;
    }
    // 星球信息
    interface PlanetInfo {
      id: number;
      name: string; // 星球名
      owner: string; // 当前所有人
      oldOwner: string; // 上一个所有人
      rarity: 1 | 2 | 3 | 4 | 5 | 6; // 品质1-6
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
      defense: number; // 防御加成
      attack: number; // 攻击加成
      hp: number; // hp加成
      product: number; // 产能加成
      build: number; // 建筑成本
      is_available: boolean; // 是否处于星球联盟 0不属于 1属于
      max_stone: number; // 最大储存矿石
      max_energy: number; // 最大储存能量
      max_population: number; // 最大储存人口
      status: number; // 1星球升级 2星球强化 3建筑升级 4建筑恢复耐久
      status_countdown: number; // 倒计时
      exp: number; // 当前经验值
    }

    interface UpgradePlanetInfo {
      consume_population: number;
      consume_star: number;
      consume_stone: number;
      consume_energy: number;
      estimate_max_building_level: number;
      estimate_planet_info: PlanetInfo;
      material_planet_num: number;
      now_max_building_level: number;
      now_planet_info: PlanetInfo;
      space_utilization: string;
      upgrade_time: number;
      upgrade_exp: number; // 最大经验值
      success?: boolean;
    }
  }
}
