export interface StrengthenPlanetInfo {
  id: number;
  name: string;
  owner: string;
  oldOwner: string;
  rarity: number;
  level: number;
  strengthenLevel: number;
  working: boolean;
  workTime: number;
  areaX: number;
  areaY: number;
  oreYield: number;
  oreConsumption: number;
  energyYield: number;
  energyConsumption: number;
  populationYield: number;
  populationConsumption: number;
  settleAt: number;
  addTime: number;
  update_finish_time: number;
  strengthen_finish_time: number;
  plunder_speed: number;
  is_available: boolean;
}

// 星球培育信息
export interface StrengthenConsumeType {
  consume_bnb: number;
  estimate_buff: {
    defense: number;
    attack: number;
    hp: number;
    hit: number;
    speed: number;
    miss: number;
    critical: number;
  };
  now_buff: {
    defense: number;
    attack: number;
    hp: number;
    hit: number;
    speed: number;
    miss: number;
    critical: number;
  };
  now_level: number;
  next_level: number;
}
