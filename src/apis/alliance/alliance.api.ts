import { Http } from '../http';

export class AllianceApi extends Http {
  // 获取我的星球联盟
  async getMyPlanetAlliance() {
    const res = await this.get('alliance/list');
    return res;
  }
}
