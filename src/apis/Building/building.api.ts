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
  ): Promise<Api.Response<{ data: Api.Building.CreateBuildingParams }>> {
    const res = await this.post(`buildings/create`, params);
    return res;
  }

  // 预估建筑升级
  async estimateBuildingUpgrade(
    planet_id: number,
    building_id: number | string,
  ): Promise<Api.Response<{ data: Api.Building.CreateBuildingParams }>> {
    const res = await this.get(`buildings/upgrade_cost`, {
      planet_id,
      building_id,
    });
    return res;
  }

  // 预估建筑升级之后的建筑详情
  async estimateBuildingUpgradeDetail(
    planet_id: number,
    building_id: number | string,
  ): Promise<Api.Response<{ data: Api.Building.CreateBuildingParams }>> {
    const res = await this.get(`buildings/upgrade_detail`, {
      planet_id,
      building_id,
    });
    return res;
  }
}
