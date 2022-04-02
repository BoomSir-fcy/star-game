import qs from 'qs';
import { Http } from '../http';

export class PlanetApi extends Http {
  // 我的星球
  async getMePlanet(
    params: Api.Planet.PageParams,
  ): Promise<Api.Response<{ Data: Api.Planet.PlanetInfo[] }>> {
    const res = await this.get('planet/myplanet', params);
    return res;
  }

  // 我的星球强化的预计结果
  async getPlanetStrengthen(params: Api.Planet.Strengthen) {
    const res = await this.get('planet/Strengthen_estimate', params);
    return res;
  }

  // 星球培育
  async StrengthenPlante(params: Api.Planet.StrengthenPost) {
    const res = await this.post('planet/Strengthen', params);
    return res;
  }

  // 获取星球强化的结果
  async StrengthenResult(params: Api.Planet.StrengthenPost) {
    const res = await this.post('planet/Strengthen_result', params);
    return res;
  }

  // 星球详情
  async getPlanetInfo(
    ids: number[] | string[],
  ): Promise<Api.Response<{ Data: Api.Planet.PlanetInfo[] }>> {
    return this.get(`/planet/info?token_id=${JSON.stringify(ids)}`);
  }

  // 升级星球信息
  async getUpgradePlanetInfo(planet_id: number): Promise<Api.Response<any>> {
    return this.get(`/planet/can_upgrade`, { planet_id });
  }

  // 升级所需材料星球列表
  async getMaterialList(planet_id: number): Promise<Api.Response<any>> {
    return this.get(`/planet/material_list`, { planet_id });
  }

  // 星球是否升级成功
  async getUpgradeSuccess(planet_id: number): Promise<Api.Response<any>> {
    return this.post(`/planet/upgrade_success`, { planet_id });
  }

  // 获取行星是否能够工作
  async getPlanetCaWork(params: Api.Planet.StrengthenPost) {
    const res = await this.get('planet/can_work', params);
    return res;
  }
}
