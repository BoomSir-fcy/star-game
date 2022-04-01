import { Http } from '../http';

export class BuildingApi extends Http {
  // 获取所有建筑
  async getBuildingList(
    type?: 1 | 2,
  ): Promise<Api.Response<{ Data: Api.Planet.PlanetInfo[] }>> {
    const res = await this.get(`/buildings/list`, { type });
    return res;
  }
}
