import { Api } from 'apis';
import { MysteryBoxView } from 'state/types';
import { getMysteryBoxContract } from 'utils/contractHelpers';

export const fetchBoxView = async (
  account: string,
): Promise<MysteryBoxView | null> => {
  try {
    const contract = getMysteryBoxContract();
    const res = await contract.boxView({ from: account });
    const stkBnbRateRes = await contract.stkBnbRate();

    console.log(stkBnbRateRes);

    return {
      priceBNB: res.priceBNB.map((item: any) => item?.toJSON().hex), // 三种盲盒对应的bnb价格
      seedBlocks: res.seedBlocks.map((item: any) => item?.toJSON().hex), // 三种盲盒对应的预定区块, 与当前区块相差超过230个区块应让用户重新预定
      burnRatio: res.burnRatio?.toJSON().hex, // 销毁比例
      vdsgRatio: res.vdsgRatio?.toJSON().hex, // 给vdsg的比例
      dsgPoolRatio: res.dsgPoolRatio?.toJSON().hex, // 给dsg质押池的比例
      bnbPoolRatio: res.bnbPoolRatio?.toJSON().hex, // 给bnb质押池的比例
      superiorRatio: res.superiorRatio?.toJSON().hex, // 给邀请人的比例
      defaultSuperior: res.defaultSuperior, // 默认邀请人
      miniDistributeAmount: res.miniDistributeAmount?.toJSON().hex, //
      totalBurnt: res.totalBurnt?.toJSON().hex, // 总销毁量dsg
      totalVDsgDonated: res.totalVDsgDonated?.toJSON().hex, // 总给vdsg的量dsg
      totalPoolSent: res.totalPoolSent?.toJSON().hex, // 总给质押池的量dsg
      totalPoolSentBNB: res.totalPoolSentBNB?.toJSON().hex, // 总给质押池的量bnb
      maxSales: res.maxSales?.toJSON().hex, // 最大可销售量
      sold: res.sold?.toJSON().hex, // 已销售量
      maxHeld: res.maxHeld?.toJSON().hex, // 每种盲盒最大可持有的数量
      boxCount: [],
      stkBnbRate: stkBnbRateRes?.toJSON().hex, // stk价格比例  stkBnb价格 = stkBnbRate/10000 * bnb价格
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const fetchUserKeys = async (
  account: string,
): Promise<{ boxCount: string[] }> => {
  try {
    const contract = getMysteryBoxContract();
    const res = await contract.getUserKeys(account);
    return {
      boxCount: [
        res.box0Count.toJSON().hex,
        res.box1Count.toJSON().hex,
        res.box2Count.toJSON().hex,
      ],
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};
