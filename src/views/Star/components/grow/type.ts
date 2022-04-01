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
