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
  async plunderStar(galaxyId: number, starId: number) {
    return this.post('galaxy/attck', { nft_id: galaxyId, number: starId });
  }

  // 星系竞拍记录列表
  async getAuctionLogList(
    galaxyId: number,
  ): Promise<Api.Response<{ record: any[] }>> {
    return this.get(`galaxy/auction-logs/${galaxyId}`);
  }

  // 获取最大领取数量
  async getClaimMax(
    galaxyId: number,
  ): Promise<Api.Response<{ amount: number }>> {
    return this.get(`galaxy/claim/max`, { galaxy_id: galaxyId });
  }

  // 领取奖励
  async ClaimRewards(galaxyId: number) {
    return this.post(`galaxy/claim`, { galaxy_id: galaxyId });
  }
}
