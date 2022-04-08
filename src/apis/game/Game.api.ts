import { Api } from 'apis/api.api';
import { Http } from '../http';

export class GameApi extends Http {
  // 获取星球战斗建筑
  async getGamePlanetUnits(planet_id: number): Promise<Api.Response<Api.User.UserInfo>> {
    return this.get(`game/planet/units`, { planet_id });
  }

  // 战斗基础单位列表 种族 1 神族 2 人族 3虫族
  async getGameUnitList(race: 1|2|3): Promise<Api.Response<Api.Game.UnitListRes>> {
    return this.get(`game/unit/list`, { race });
  }

  async gameUnitSetting(params: Api.Game.ParamsUnitSetting) {
    return this.post('game/unit/setting', params)
  }

}