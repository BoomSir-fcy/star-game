import { Api } from "apis";
import { MysteryBoxView, UserAgentInfoView, UserInfoView } from "state/types";
import { getUserAgentAddress } from "utils/addressHelpers";
import { getBep20Contract, getMysteryBoxContract, getUserAgentContract } from "utils/contractHelpers"

export const fetchBoxView = async (account: string): Promise<MysteryBoxView|null> => {
  try {
    const contract = getMysteryBoxContract();
    const res = await contract.boxView({ from: account });
    return {
      priceBNB: res.priceBNB.map((item: any) => item.toJSON().hex), // 三种盲盒对应的bnb价格
      seedBlocks: res.seedBlocks.map((item: any) => item.toJSON().hex), // 三种盲盒对应的预定区块, 与当前区块相差超过230个区块应让用户重新预定
      burnRatio: res.burnRatio.toJSON().hex, // 销毁比例
      vdsgRatio: res.vdsgRatio.toJSON().hex, // 给vdsg的比例
      dsgPoolRatio: res.dsgPoolRatio.toJSON().hex, // 给dsg质押池的比例
      bnbPoolRatio: res.bnbPoolRatio.toJSON().hex, // 给bnb质押池的比例
      superiorRatio: res.superiorRatio.toJSON().hex, // 给邀请人的比例
      defaultSuperior: res.defaultSuperior, // 默认邀请人
      miniDistributeAmount: res.miniDistributeAmount.toJSON().hex, // 
      totalBurnt: res.totalBurnt.toJSON().hex, // 总销毁量dsg
      totalVDsgDonated: res.totalVDsgDonated.toJSON().hex, // 总给vdsg的量dsg
      totalPoolSent: res.totalPoolSent.toJSON().hex, // 总给质押池的量dsg
      totalPoolSentBNB: res.totalPoolSentBNB.toJSON().hex, // 总给质押池的量bnb
    }
  } catch (error) {
    console.error(error)
    return null;
  }
}