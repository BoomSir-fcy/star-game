import { Api } from 'apis';
import BigNumber from 'bignumber.js';
import { GalaxyInfo, GalaxyNft } from 'state/types';
import { getGalaxyAddress } from 'utils/addressHelpers';
import { getGalaxyContract } from 'utils/contractHelpers';
import { getBalanceAmount } from 'utils/formatBalance';
import multicall from 'utils/multicall';
import GalaxyAbi from 'config/abi/Galaxy.json';

export const fetchGalaxyList = async () => {
  try {
    const res = await Api.GalaxyApi.getGalaxyList();
    if (Api.isSuccess(res)) {
      return res.data;
    }
    return null;
  } catch (error) {
    console.error(`fetch fetchGalaxyList error: ${error}`);
    return null;
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

export const fetchGetNftViewList = async (List: GalaxyInfo[]) => {
  const GalaxyAddress = getGalaxyAddress();
  const calls = List.map(item => {
    return {
      address: GalaxyAddress,
      name: 'getNftView',
      params: [item.id],
    };
  });
  try {
    const Arr = await multicall(GalaxyAbi, calls);
    const RtArr = Arr.map(item => {
      const res = item[0];
      return {
        id: res.id.toJSON().hex,
        lastPrice: res.lastPrice.toJSON().hex,
        currentPrice: res.currentPrice.toJSON().hex,
        miniBuyDuration: res.miniBuyDuration.toJSON().hex,
        lastTimestamp: res.lastTimestamp.toJSON().hex,
      };
    });
    return RtArr;
  } catch (error) {
    console.error(`fetch fetchGetNftView error: ${error}`);
    return [];
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

export const fetchAllLogs = async () => {
  try {
    const res = await Api.GalaxyApi.getAllLogs();
    if (Api.isSuccess(res)) {
      return res.data?.record;
    }
    return [];
  } catch (error) {
    console.error(`fetch fetchAllLogs error: ${error}`);
    return [];
  }
};

export const fetchOwnerInfo = async (nft_id: number) => {
  try {
    const res = await Api.GalaxyApi.getOwnerInfo(nft_id);
    if (Api.isSuccess(res)) {
      return res.data;
    }
    return null;
  } catch (error) {
    console.error(`fetch fetchOwnerInfo error: ${error}`);
    return null;
  }
};

export const fetchGalaxReportList = async (
  start_time: number,
  end_time: number,
) => {
  try {
    const res = await Api.GalaxyApi.getGalaxReport({
      start_time,
      end_time,
    });
    if (Api.isSuccess(res)) {
      return res?.data?.list;
    }
    return null;
  } catch (error) {
    console.error(`fetch fetchGalaxReportList error: ${error}`);
    return null;
  }
};
