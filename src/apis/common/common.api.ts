import { Http } from '../http';

export class CommonApi extends Http {
  // 获取时间速率
  async getTimeRate(): Promise<Api.Response<Api.Common.Info>> {
    const res = await this.get('time/timestamp/tick');
    return res;
  }

  // 设置时间速率
  async setTimeRate(rate: number) {
    const res = await this.post('time/timestamp/rate', { rate });
    return res;
  }

  async setReset() {
    const res = await this.lang_get('reset', 10 * 60 * 1000);
    return res;
  }
}
