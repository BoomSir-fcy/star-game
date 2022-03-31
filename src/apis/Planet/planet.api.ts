import { Http } from '../http';

export class PlanetApi extends Http {
  // 我的星球
  async getMePlanet(params: Api.Planet.PageParams) {
    const res = await this.get('planet/myplanet', params);
    return res;
  }
}
