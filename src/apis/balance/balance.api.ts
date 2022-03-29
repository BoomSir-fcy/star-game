import { Http } from '../http';

export class BalanceApi extends Http {
  // 取用户余额
  async getUserBalance() {
    const res = await this.get('balance/list');
    return res;
  }
}
