import { Http } from '../http';

export class GuideApi extends Http {
  // 获取新手引导步骤
  async getGuide(params: Api.Guide.guideParams) {
    const res = await this.get('begin/guide/get', params);
    return res;
  }

  // 设置新手引导步骤
  async setGuide(params: Api.Guide.guideParams) {
    const res = await this.post('begin/guide/set', params);
    return res;
  }
}
