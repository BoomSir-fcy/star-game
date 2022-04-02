declare namespace Api {
  namespace Building {
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
