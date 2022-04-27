import { Api } from 'apis/api.api';
import { Http } from '../http';

export class GameApi extends Http {
  // 获取星球战斗建筑
  async getGamePlanetUnits(
    planet_id: number,
  ): Promise<Api.Response<Api.Game.UnitPlanetRes>> {
    return this.get(`game/planet/units`, { planet_id });
  }

  // 战斗基础单位列表 种族 1 神族 2 人族 3虫族
  async getGameUnitList(
    race: number,
  ): Promise<Api.Response<Api.Game.UnitListRes>> {
    return this.get(`game/unit/list`, { race });
  }

  async gameUnitSetting(params: Api.Game.ParamsUnitSetting) {
    return this.post('game/unit/setting', params);
  }

  async gamePK(player1: number, player2: number, max_round?: number) {
    return this.post('game/pk', { player1, player2, max_round });
  }

  async testInit(params: Api.Game.ParamsUnitSettingTest) {
    return this.post('test/simulatewar/init', params);
  }

  async testGet(tag: string) {
    return this.get('test/simulatewar/get', { tag });
  }

  async testPk(tag: string, max_round?: number, terrain_id?: number) {
    return this.get('test/simulatewar/pk', { tag, max_round, terrain_id });
  }

  // 获取地形
  async Gameterrain() {
    return this.get('game/war/terrain');
  }

  // 模拟战斗信息
  async Gamemock(params: Api.Game.gameMocksParams) {
    const res = await this.post(`game/unit/simulation-init`, params);
    return res;
  }

  // 获取模拟战斗详情
  async GamemockDetail(from: number) {
    const res = await this.post(`game/unit/simulation`, { from });
    return res;
  }
}
