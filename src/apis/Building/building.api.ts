import { Http } from '../http';

export class BuildingApi extends Http {
  // 获取储物罐最大充值金额
  async getMaxReCharge(
    planet_id: number,
  ): Promise<Api.Response<Api.Building.Store>> {
    return this.get(`buildings/store/max_recharge`, { planet_id });
  }

  // 获取行星联盟储物罐最大充值金额
  async getAllianceMaxReCharge(): Promise<Api.Response<Api.Building.Store>> {
    return this.get(`buildings/alliance_store/max_recharge`);
  }

  // 储物罐充值
  async storeReCharge(params: Api.Building.StoreRechargeParams) {
    return this.post(`buildings/store/recharge`, params);
  }

  // 储物罐提取
  async storeExtract(params: Api.Building.StoreRechargeParams) {
    return this.post(`planet/store/extract`, params);
  }

  // 行星联盟储物罐充值
  async storeAllianceReCharge(
    params: Api.Building.AllianceStoreRechargeParams,
  ) {
    return this.post(`buildings/alliance_store/recharge`, params);
  }

  // 获取所有建筑
  async getBuildingList(
    type: number,
    race: number,
  ): Promise<Api.Response<{ data: Api.Building.Building[] }>> {
    const res = await this.get(`/buildings/list`, { type, race });
    return res;
  }

  // 获取星球建筑列表
  async getPlanetBuildingList(
    planet_id: number | string,
  ): Promise<Api.Response<{ data: any; upgradeInfo: any }>> {
    const res = await this.get(`planet/buildings/list`, { planet_id });
    return res;
  }

  // 获取星球储物罐资源
  async getStore(planet_id) {
    const res = await this.get(`planet/store/resource`, { planet_id });
    return res;
  }

  // 修复耐久度
  async setRepairBuilding(params: Api.Building.BuildingsOperateParams) {
    const res = await this.post(`buildings/repair`, params);
    return res;
  }

  // 修复耐久度
  async setBatchRepairBuilding(planet_id: number[]) {
    const res = await this.post(`buildings/repair_all_durability`, {
      planet_id,
    });
    return res;
  }

  // 获取建筑耐久恢复需要的资源
  async getRepairBuilding(params: Api.Building.BuildingsOperateParams) {
    const res = await this.get(`buildings/repair_cost`, params);
    return res;
  }

  // 获取一键修复需要消耗的资源
  async getBatchRepairBuilding(planet_id: number[]) {
    const res = await this.get(`buildings/repair_all_durability_cost`, {
      planet_id,
    });
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

  // 创建建筑工作队列
  async createQueueBuilding(params: Api.Building.CreateBuildingParams) {
    const res = await this.post(`buildings/add_work_queue`, params);
    return res;
  }

  // 刷新工作队列
  async refreshQueue(planet_id: number, params?: any) {
    const res = await this.post(`buildings/refresh_work_queue`, {
      planet_id,
      ...params,
    });
    return res;
  }

  // 刷新工作队列
  async cancelWorkQueue(planet_id: number, work_queue_id: number) {
    const res = await this.post(`buildings/cancel_work_queue`, {
      planet_id,
      work_queue_id,
    });
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
    target_level?: number | string,
  ): Promise<Api.Response<{ data: Api.Building.upgradeDetailData }>> {
    const res = await this.get(`buildings/upgrade_detail`, {
      planet_id,
      building_id,
      target_level,
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

  // 获取buff加成
  async getBuff(params: Api.Building.GetPlanetBuildingParams) {
    const res = await this.get('buildings/attack_buff', params);
    return res;
  }
}
