import { Http } from '../http';

export class AllianceApi extends Http {
  // 获取我的星球联盟
  async getMyPlanetAlliance() {
    const res = await this.get('alliance/list');
    return res;
  }

  // 获取星球联盟探索进度
  async getExploreProgress() {
    const res = await this.get('work/progress');
    return res;
  }

  // 行星联盟开始工作
  async AllianceWorking(params: Api.Alliance.StartWorking) {
    const res = await this.post('alliance/worker/start', params);
    return res;
  }

  // 行星联盟停止工作
  async AllianceStopWork() {
    const res = await this.post('alliance/worker/end');
    return res;
  }

  // 匹配用户
  async alliancePlunderInfo(
    address?: string,
  ): Promise<Api.Response<Api.Alliance.PlunderInfoMatchUser>> {
    return this.get('alliance/plunder/info', { address });
  }

  // 行星联盟掠夺
  async alliancePlunder(params: Api.Alliance.Plunder): Promise<any> {
    return this.post('alliance/plunder', params);
  }

  // 行星联盟提取资源
  async AllianceExtract(params: Api.Building.AllianceStoreRechargeParams) {
    const res = await this.post('buildings/store/extract', params);
    return res;
  }

  // 获取掠夺战斗记录
  async getMyCombatRecord(params: Api.Alliance.Record) {
    const res = await this.get('alliance/combat/record', params);
    return res;
  }

  // 获取消息列表
  async getMyMessage(params: Api.Alliance.News) {
    const res = await this.get('message/list', params);
    return res;
  }
}
