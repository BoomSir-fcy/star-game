import { Http } from '../http';

export class BalanceApi extends Http {
  // 取用户余额
  async getUserBalance() {
    const res = await this.get('balance/list');
    return res;
  }

  // 提币
  async withdraw(params: Api.Balance.DrawbalanceSignMessage) {
    const res = await this.post('balance/withdraw', params);
    return res;
  }
}
