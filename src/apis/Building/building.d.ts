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

    interface AllianceStoreRechargeParams {
      nonce: string;
      timestamp: number;
      signature: string;
    }

    interface StoreRechargeParams extends AllianceStoreRechargeParams {
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
      building: {
        _id: number;
      };
      work_queue_id?: number;
      isbuilding?: boolean;
      isactive?: boolean; // 是否激活
      iscreate?: boolean; // 是否已经保存创建建筑了
      isqueue?: boolean; // 是否加入队列中，可以取消
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
      build_type?: number;
      work_queue_params: CreateworkQueueParams;
    }

    interface CreateworkQueueParams {
      work_type: 1 | 2; // 1-建造 2-升级
      building_create_param?: BuildingSetting;
      building_upgrade_param?: {
        buildings_id: number;
        building_number: number;
      };
    }

    interface BuildingSetting {
      buildings_id: number;
      building_number: number;
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
      now_durability: number;
      size: BuildingSize;
    }

    interface BuildingSize {
      area_x: number;
      area_y: number;
    }

    interface GetPlanetBuildingParams {
      planet_id: number;
      building_id?: string;
    }

    interface BuildingBuffer {
      attack?: number;
      build_id?: string;
      critical?: number;
      defense?: number;
      hit?: number;
      hp?: number;
      miss?: number;
      speed?: number;
    }

    interface upgradeDetailData {
      building_detail: BuildingDetail;
      estimate_building_detail: estimate_building_detail;
    }

    interface AkBonusMachine {
      defense: number;
      attack: number;
      hp: number;
      hit: number;
      speed: number;
      miss: number;
      critical: number;
    }

    interface Arms {
      unique_id: number;
      number: number;
      probability: number;
      cost_energy: number;
      cost_time: number;
      cost_stone: number;
      cost_pop: number;
      count: number;
      store_max: number;
      game_base_unit: GameBaseUnit;
    }

    interface ArmsAttr {
      hp: number;
      ak: number;
      df: number;
      hit: number;
      crit: number;
      miss: number;
      range: number;
      move: number;
    }

    interface AttackEffect {
      attack_effect_id: number;
      beat_back: BeatBack;
    }

    interface BeatBack {
      direction: number;
      carsh_harm_percent: number;
      around_units: any[];
    }

    interface BuildingDetail {
      _id: string;
      buildings_number: number;
      race: number;
      type: number;
      propterty: Propterty;
      last_max_durability_time: number;
      detail_type: number;
      build_type: number;
      store: Store;
      stone: Stone;
      energy: Stone;
      population: Stone;
      ak_bonus_machine: AkBonusMachine;
      petri_dish: PetriDish;
      build_need_time: number;
      picture: string;
      upgrade_time: number;
      restoring_durability_consume_stone: number;
      restoring_durability_consume_population: number;
      restoring_durability_consume_energy: number;
      restoring_durability_time: number;
      cellar: Cellar;
      upgrade_need: UpgradeNeed;
      exp: number;
    }

    interface Cellar {
      protect_energy: number;
      protect_stone: number;
      protect_population: number;
    }

    interface GameBaseUnit {
      unique_id: number;
      number: number;
      race: number;
      level: number;
      tag: string;
      speed: number;
      hp: number;
      ak: number;
      df: number;
      move_far: number;
      hit: number;
      dodge: number;
      crit: number;
      crit_damage: number;
      ak_range_min: number;
      ak_range_max: number;
      skip_barrir_move: boolean;
      skip_barrir_atk: boolean;
      move_rule: number;
      attack_rule: number;
      attack_effect: string;
      immune_frozen: boolean;
      immune_firing: boolean;
      immune_lock_move: boolean;
      action_nation: number;
      power: number;
      index: string;
      arms_attr: ArmsAttr;
      attack_type: number;
      skill_type: number;
      count: number;
      build_id: string;
    }

    interface PetriDish {
      arms: Arms[];
    }

    interface Propterty {
      name_cn: string;
      name_en: string;
      size: Size;
      levelEnergy: number;
      max_durability: number;
      now_durability: number;
      per_durability: number;
      per_cost_energy: number;
      per_cost_stone: number;
      per_cost_population: number;
    }

    interface RootInterface {
      code: number;
      message: string;
      data: Data;
    }

    interface Size {
      area_x: number;
      area_y: number;
    }

    interface Stone {
      product: any;
    }

    interface Store {
      upper_if: string;
      store_max_stone: number;
      store_max_energy: number;
      store_max_population: number;
      store_stone: number;
      store_energy: number;
      store_population: number;
      charge_stone: number;
      charge_energy: number;
      charge_population: number;
      last_extract_time: number;
    }

    interface UpgradeNeed {
      upgrade_box: number;
      upgrade_energy: number;
      upgrade_stone: number;
      upgrade_population: number;
      upgrade_time: number;
      upgrade_start_time: number;
    }
  }
}
