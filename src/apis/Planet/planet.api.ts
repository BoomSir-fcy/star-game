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

  async StrengthenPlante(params: Api.Planet.StrengthenPost) {
    const res = await this.post('planet/Strengthen', params);
    return res;
  }

  // 星球详情
  async getPlanetInfo(
    ids: number[] | string[],
  ): Promise<Api.Response<{ Data: Api.Planet.PlanetInfo[] }>> {
    return this.get(`/planet/info?token_id=${JSON.stringify(ids)}`);
  }
}
