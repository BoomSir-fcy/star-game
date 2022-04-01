import { Http } from '../http';

export class PlanetApi extends Http {
  // 我的星球
  async getMePlanet(params: Api.Planet.PageParams) {
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
}
