import { Http } from '../http';

export class AllianceApi extends Http {
  // 获取我的星球联盟
  async getMyPlanetAlliance() {
    const res = await this.get('alliance/list');
    return res;
  }

  // 行星联盟开始工作
  async AllianceWorking() {
    const res = await this.post('alliance/worker/start');
    return res;
  }

  // 行星联盟停止工作
  async AllianceStopWork() {
    const res = await this.post('alliance/worker/end');
    return res;
  }

  // 匹配用户
  async alliancePlunderInfo(
    our: 1 | 2,
  ): Promise<Api.Response<Api.Alliance.PlunderInfoMatchUser>> {
    return this.get('alliance/plunder/info', { our });
  }

  // 行星联盟掠夺
  async alliancePlunder(
    params: Api.Alliance.Plunder,
  ): Promise<Api.Response<Api.Alliance.PlunderInfoMatchUser>> {
    return this.post('alliance/plunder', params);
  }

  // 行星联盟提取资源
  async AllianceExtract() {
    const res = await this.post('buildings/store/extract');
    return res;
  }
}
