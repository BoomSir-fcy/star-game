declare namespace Api {
  namespace Game {

    type race = 1 | 2 | 3; // 种族 1 神族 2 人族 3虫族

    interface UnitInfo {
      unique_id: number,
      race: race,
      hp: number,
      ak: number,
      df: number,
      move_far: number,
      ak_range_min: number,
      ak_range_max: number,
      skip_barrir_move: boolean,
      skip_barrir_ak: boolean,
      ak_back: boolean,
      ak_front: boolean,
      ak_hold: boolean,
      ak_hold_value: number,
      firing: boolean,
      firing_value: number,
      ak_self: boolean,
      ak_self_value: number,
      move_rule: number,
      attack_rule: number,
      unlock_level: 0
    }

    interface UnitListRes {
      units: {
        [id: string]: UnitInfo;
      }
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
      }

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
      "SSID": "string"
    }
  }
}
