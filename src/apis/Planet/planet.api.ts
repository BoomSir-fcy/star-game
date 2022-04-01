import qs from 'qs';
import { Http } from '../http';

export class PlanetApi extends Http {
  // 我的星球
  async getMePlanet(params: Api.Planet.PageParams) {
    const res = await this.get('planet/myplanet', params);
    return res;
  }

  // 星球详情
  async getPlanetInfo(
    ids: number[] | string[],
  ): Promise<Api.Response<{ Data: Api.Planet.PlanetInfo[] }>> {
    return this.get(`/planet/info?token_id=${JSON.stringify(ids)}`);
  }
}
