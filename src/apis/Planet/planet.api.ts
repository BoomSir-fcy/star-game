import { Http } from '../http';

export class PlanetApi extends Http {
  // 我的星球
  async getMePlanet(
    params: Api.Planet.PageParams,
  ): Promise<Api.Response<null>> {
    return this.get('/planet/myplanet', params);
  }
}
