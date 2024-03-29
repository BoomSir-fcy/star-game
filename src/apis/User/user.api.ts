import { Http } from '../http';

export class UserApi extends Http {
  // 取指定用户信息
  async getUserInfo(uid: number): Promise<Api.Response<Api.User.UserInfo>> {
    return this.get(`user/get/${uid}`);
  }

  // 取指定用户信息
  async getUserInfoByAccount(
    account: string,
  ): Promise<Api.Response<Api.User.UserInfo>> {
    return this.get(`user/get-with-address/${account.toLowerCase()}`);
  }

  // 用户登录
  async userSignIn(
    params: Api.User.ParamsSignIn,
  ): Promise<Api.Response<Api.User.SignIn>> {
    return this.post('user/signin', params, { ignoreSSID: true });
  }

  // 用户登出
  async userSignOut(): Promise<Api.Response<null>> {
    return this.post('user/signout');
  }

  // 登出所有会话接口
  async userSignOutAll(): Promise<Api.Response<null>> {
    return this.post('user/signout-all');
  }

  // 获取用户邀请信息
  async getInvite() {
    const res = await this.get('user/invite');
    return res;
  }

  // 获取用户有没有注册成功
  async getCheck(params: Api.User.CheckParams) {
    const res = await this.get('user/check', params);
    return res;
  }

  // vip权益
  async getVipBenefits() {
    const res = await this.get('user/vip-status');
    return res;
  }

  async getVipConfig() {
    const res = await this.get('user/vip-config');
    return res;
  }

  // 能够购买的vip列表
  async getVipList() {
    const res = await this.get('user/can-buy-vip-list');
    return res;
  }

  // 购买vip
  async buyVip(vip_id: number) {
    const res = await this.post('user/buy-vip', { vip_id });
    return res;
  }
}
