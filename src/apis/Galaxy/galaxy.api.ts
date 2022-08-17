import { Http } from '../http';

export class GalaxyApi extends Http {
  // 星系列表
  async getGalaxyList(): Promise<
    Api.Response<{ data: Api.Galaxy.GalaxyInfo[] }>
  > {
    return this.get(`galaxy/all`);
  }

  // 恒星列表
  async getGalaxyStarList(
    nftId: number,
  ): Promise<Api.Response<Api.Galaxy.GalaxyStarList>> {
    return this.get(`galaxy/list`, { nft_id: nftId });
  }

  // 占领恒星
  async holdStar(galaxyId: number, starId: number) {
    return this.post('galaxy/hold', { nft_id: galaxyId, number: starId });
  }

  // 抢夺恒星
  async plunderStar(params: Api.Galaxy.AttckStarParams) {
    return this.post('galaxy/attck', params);
  }

  // 放弃占领
  async giveupStar(params: Api.Galaxy.AttckStarParams) {
    return this.post('galaxy/give_up', params);
  }

  // 星系竞拍记录列表
  async getAuctionLogList(
    galaxyId: number,
  ): Promise<Api.Response<{ record: any[] }>> {
    return this.get(`galaxy/auction-logs/${galaxyId}`);
  }

  // 获取星系最大领取数量
  async getClaimMax(
    galaxyId: number,
  ): Promise<Api.Response<{ amount: number }>> {
    return this.get(`galaxy/claim/max`, { galaxy_id: galaxyId });
  }

  // 领取星系奖励
  async ClaimRewards(galaxyId: number) {
    return this.post(`galaxy/claim`, { galaxy_id: galaxyId });
  }

  // 获取恒星最大领取数量
  async getPlanetClaimMax(
    galaxyId: number,
  ): Promise<Api.Response<{ amount: number }>> {
    return this.get(`galaxy_planet/claim/max`, { galaxy_id: galaxyId });
  }

  // 领取恒星奖励
  async ClaimPlanetRewards(galaxyId: number) {
    return this.post(`galaxy/planet/claim`, { galaxy_id: galaxyId });
  }

  // 获取所有星系拍卖记录列表
  async getAllLogs() {
    const res = await this.get('galaxy/all-auction-logs');
    return res;
  }

  // 获取星系拥有者详情
  async getOwnerInfo(nft_id: number) {
    const res = await this.get('galaxy/owner/info', { nft_id });
    return res;
  }
}
