declare namespace Api {
  namespace Game {
    type race = 1 | 2 | 3; // 种族 1 神族 2 人族 3虫族

    interface UnitInfo {
      unique_id: number; //
      race: race; // 种族
      hp: number; // 血量
      ak: number; // 攻击力
      df: number; // 防御力
      move_far: number; // 移动距离
      ak_range_min: number; // 攻击范围
      ak_range_max: number; // 是否可以跨越障碍行动
      skip_barrir_move: boolean; // 是否可以跨越障碍攻击
      skip_barrir_ak: boolean; // 是否，友军伤害
      ak_back: boolean; // 是否有击退
      ak_front: boolean; // 是否有牵引
      ak_hold: boolean; // 是否禁锢
      ak_hold_value: number; // 禁锢数值
      firing: boolean; // 是否有灼烧
      firing_value: number; // 灼烧数值
      ak_self: boolean; // 自伤
      ak_self_value: number; // 自伤数值Z
      move_rule: number; // 移动规则
      attack_rule: number; // 攻击规则
      unlock_level: 0; // 解锁等级
    }

    interface UnitListRes {
      units: {
        [id: string]: UnitInfo;
      };
    }

    interface UnitPlanetPos {
      base_unit_id: number;
      pos: {
        x: number;
        y: number;
      };
      speed: number;
    }
    interface UnitPlanetRes {
      units: {
        plaet_id: number;
        units: UnitPlanetPos[];
      };
    }

    interface ParamsUnit {
      pos: {
        x: number;
        y: number;
      };
      speed: number; // 出手顺序
      unit_id: number;
    }
    interface ParamsUnitSetting {
      planet_id: number;
      units: ParamsUnit[];
    }

    interface SignIn {
      SSID: 'string';
    }
  }
}
