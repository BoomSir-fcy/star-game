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
  ): Promise<Api.Response<{ data: any; upgradeInfo: any }>> {
    const res = await this.get(`planet/buildings/list`, { planet_id });
    return res;
  }

  // 修复耐久度
  async setRepairBuilding(params: Api.Building.BuildingsOperateParams) {
    const res = await this.post(`buildings/repair`, params);
    return res;
  }

  // 获取建筑耐久恢复需要的资源
  async getRepairBuilding(params: Api.Building.BuildingsOperateParams) {
    const res = await this.get(`buildings/repair_cost`, params);
    return res;
  }

  // 加速恢复建筑耐久度
  async quickRepairBuilding(params: Api.Building.BuildingsOperateParams) {
    const res = await this.post(`buildings/repair_quick`, params);
    return res;
  }

  // 更新建筑恢复耐久
  async updateRepairBuilding(params: Api.Building.BuildingsOperateParams) {
    const res = await this.post(`buildings/repair_update`, params);
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

  // 加速升级建筑
  async accelerateBuildingUpgrade(params: Api.Building.BuildingsOperateParams) {
    const res = await this.post(`buildings/upgrade_quick`, params);
    return res;
  }

  // 建筑升级完成
  async finishBuildingUpgrade(params: Api.Building.BuildingsOperateParams) {
    const res = await this.post(`buildings/upgrade_complete`, params);
    return res;
  }

  // 建筑升级
  async upgradeBuilding(params: Api.Building.BuildingsOperateParams) {
    const res = await this.post(`buildings/upgrade`, params);
    return res;
  }

  // 销毁建筑
  async destroyBuilding(params: {
    planet_id: number;
    build_type: number | string;
    building_setting: string[];
  }) {
    const res = await this.post(`buildings/destory`, params);
    return res;
  }
}
