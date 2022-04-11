declare namespace Api {
  namespace Building {
    // 储物罐矿石，人口，能量数据
    interface Store {
      max_store: number;
      max_energy: number;
      max_population: number;
      already_stone: number;
      already_energy: number;
      already_population: number;
    }
    interface StoreRechargeParams {
      planet_id: number;
      energy?: number;
      stone?: number;
      population?: number;
    }

    // 建筑
    interface Building {
      buildings_number: number;
      detail_type: number;
      last_max_durability_time: number;
      next_buildings_number: number;
      parent_buildings_number: number;
      picture: string;
      type: number;
      extra: BuildingExtra;
      propterty: BuildingPropterty;
      _id: string | number;
      status?: {
        building_id: string | number;
        count_down: number;
        upgrade_type: number; // 1-升级 2-恢复耐久
      };
      isactive?: boolean; // 是否激活
    }

    interface BuildingsOperateParams {
      planet_id: number;
      building_id: string | number;
    }

    interface SelfBuildings {
      building_type: number;
      buildings: any[];
      id: string;
      planet_id: number;
    }

    interface CreateBuildingParams {
      planet_id: number | string;
      build_type: number;
      building_setting: BuildingSetting[];
    }

    interface BuildingSetting {
      buildings_id: number;
      position: any;
      index: number;
    }

    interface BuildingExtra {
      charge_energy: number;
      charge_population: number;
      charge_stone: number;
      last_extract_time: number;
      store_energy: number;
      store_max_energy: number;
      store_max_population: number;
      store_max_stone: number;
      store_population: number;
      store_stone: number;
      upper_if: UpperIf;
    }

    interface UpperIf {
      upgradeenergy: number;
      upgradeneedbox: number;
      upgradepopulation: number;
      upgradeskipwait: number;
      upgradestone: number;
      upgradetime: number;
    }

    interface BuildingPropterty {
      attack: number;
      defence: number;
      hp: number;
      levelEnergy: number;
      max_durability: number;
      name_cn: string;
      name_en: string;
      per_cost_energy: number;
      per_cost_population: number;
      per_cost_stone: number;
      per_durability: number;
      size: BuildingSize;
    }

    interface BuildingSize {
      area_x: number;
      area_y: number;
    }
  }
}
