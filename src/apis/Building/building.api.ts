import { Http } from '../http';

export class BuildingApi extends Http {
  // 获取所有建筑
  async getBuildingList(
    type?: 1 | 2,
  ): Promise<Api.Response<{ data: Api.Building.Building[] }>> {
    const res = await this.get(`/buildings/list`, { type });
    return res;
  }

  // 获取星球建筑列表
  async getPlanetBuildingList(
    planet_id: number | string,
  ): Promise<Api.Response<{ data: any }>> {
    const res = await this.get(`planet/buildings/list`, { planet_id });
    return res;
  }

  // 创建建筑
  async createBuilding(
    params: Api.Building.CreateBuildingParams,
  ): Promise<Api.Response<{ data: any }>> {
    const res = await this.post(`buildings/create`, params);
    return res;
  }
}
