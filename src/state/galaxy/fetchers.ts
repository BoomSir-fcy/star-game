import { Api } from 'apis';
import BigNumber from 'bignumber.js';
import { GalaxyNft } from 'state/types';
import { getGalaxyContract } from 'utils/contractHelpers';
import { getBalanceAmount } from 'utils/formatBalance';

export const fetchGalaxyList = async (): Promise<Api.Galaxy.GalaxyInfo[]> => {
  try {
    const res = await Api.GalaxyApi.getGalaxyList();
    if (Api.isSuccess(res)) {
      return res.data?.data || [];
    }
    return [];
  } catch (error) {
    console.error(`fetch fetchGalaxyList error: ${error}`);
    return [];
  }
};

export const fetchGalaxyStarList = async (
  galaxyId: number,
): Promise<Api.Galaxy.GalaxyStarList> => {
  try {
    const res = await Api.GalaxyApi.getGalaxyStarList(galaxyId);
    if (Api.isSuccess(res)) {
      return res.data;
    }
    return {
      galaxy: {},
      data: [],
      users: {},
    };
  } catch (error) {
    console.error(`fetch fetchGalaxyStarList error: ${error}`);
    return {
      galaxy: {},
      data: [],
      users: {},
    };
  }
};

// 星系nft信息
export const fetchGetNftView = async (tokenId: number): Promise<GalaxyNft> => {
  try {
    const contract = getGalaxyContract();
    // const res = await contract.tokenPrice(tokenId);
    const res = await contract.getNftView(tokenId);
    return {
      id: res.id.toJSON().hex,
      lastPrice: res.lastPrice.toJSON().hex,
      currentPrice: res.currentPrice.toJSON().hex,
      miniBuyDuration: res.miniBuyDuration.toJSON().hex,
      lastTimestamp: res.lastTimestamp.toJSON().hex,
    };
  } catch (error) {
    console.error(`fetch fetchGetNftView error: ${error}`);
    return {
      id: '',
      lastPrice: '0',
      currentPrice: '0',
      miniBuyDuration: '0',
      lastTimestamp: '0',
    };
  }
};

// 竞拍记录
export const fetchAuctionRecordList = async (
  galaxyId: number,
): Promise<any[]> => {
  try {
    const res = await Api.GalaxyApi.getAuctionLogList(galaxyId);
    if (Api.isSuccess(res)) {
      return res.data?.record;
    }
    return [];
  } catch (error) {
    console.error(`fetch fetchAuctionRecordList error: ${error}`);
    return [];
  }
};
