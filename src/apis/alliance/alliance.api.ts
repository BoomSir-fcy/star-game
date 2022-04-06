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
}
