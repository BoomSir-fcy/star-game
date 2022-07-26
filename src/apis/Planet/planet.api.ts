import qs from 'qs';
import { Http } from '../http';

export class PlanetApi extends Http {
  // 我的星球
  async getMePlanet(params: Api.Planet.PageParams): Promise<
    Api.Response<{
      Data: Api.Planet.PlanetInfo[];
      count: number;
      page: number;
      page_size: number;
    }>
  > {
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

  // 获取星球升级的消耗以及升级之后的期望值
  async getPlanetUpgradeInfo(planet_id: number) {
    const res = await this.get('/planet/upgrade_info', { planet_id });
    return res;
  }

  // 升级所需材料星球列表
  async getMaterialList(
    params: Api.Planet.MaterialParams,
  ): Promise<Api.Response<any>> {
    return this.get(`/planet/material_list`, params);
  }

  // 星球是否升级成功
  async getUpgradeSuccess(planet_id: number): Promise<Api.Response<any>> {
    return this.post(`/planet/upgrade_success`, { planet_id });
  }

  // 获取星球升级的消耗以及升级之后的期望值
  async getPlanetCaWork(params: Api.Planet.StrengthenPost) {
    const res = await this.get('planet/can_work', params);
    return res;
  }

  // 加速星球强化
  async StrengthenSpeedUp(params: Api.Planet.StrengthenPost) {
    const res = await this.post('planet/Strengthen_speed_up', params);
    return res;
  }

  // 升级星球
  async upgradePlanet(planet_id: number): Promise<Api.Response<any>> {
    return this.post(`/planet/upgrade`, { planet_id });
  }
}
