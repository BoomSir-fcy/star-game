import { useWeb3React } from '@web3-react/core';
import { useCallback, useEffect, useState } from 'react';
import { Api } from 'apis';

export interface Arm_productView {
  count: number;
  index: string;
  unique_id: number;
}
export interface ArmsView {
  arm_index: number;
  arm_product: Arm_productView[];
  race: number;
  total_count: number;
}
export interface Work_reportView {
  arms: ArmsView[];
  cellar_energy: number;
  cellar_population: number;
  cellar_stone: number;
  lose_arm_unit: number;
  lose_durable: number;
  plunder_energy: number;
  plunder_population: number;
  plunder_stone: number;
  product_energy: number;
  product_population: number;
  product_stone: number;
}

export interface ExplorationMsg {
  end_time: number;
  start_time: number;
  work_report: Work_reportView[];
}

export interface msgContentList {
  addTime: number;
  address: string;
  id: number;
  messageType: number;
  msgContent: string;
  readTime: number;
  sendAddress: string;
  sendImage: string;
  sendName: string;
  status: number;
  title: string;
  updateTime: number;
}

export interface MessageListType {
  count: number;
  list: msgContentList[];
}

export interface GalaxyMsg extends ExplorationMsg {
  galaxy_name?: string;
  amount?: number;
  symbol?: string;
  timestamp?: number;
  new_owner?: string;
  get_amount?: number;
  get_symbol?: string;
  get_box?: string;
  number?: number;
  new_owner_power?: number;
  hold_time?: number;
  old_amount?: number;
  galaxy_id?: number;
}

export const useFetchMessageList = () => {
  const { account } = useWeb3React();
  const [list, setList] = useState<msgContentList[]>([]);
  const [page, setPageNum] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [end, setEnd] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const getList = useCallback(async () => {
    setLoading(true); // 设为请求状态
    try {
      const res = await Api.AllianceApi.getMyMessage({
        page,
        page_size: pageSize,
      });
      if (Api.isSuccess(res)) {
        const temp = res?.data?.list;
        const nowList = page === 1 ? temp : [...list, ...temp];
        if (page * pageSize >= res?.data?.count) {
          setEnd(true);
        }

        setList(nowList);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // 请求完毕置为false
    }
  }, [page, pageSize, list, setLoading, setEnd, setList]);

  useEffect(() => {
    if (account) {
      getList();
    }
    // eslint-disable-next-line
  }, [account, page]);

  return { list, page, end, setPageNum, loading };
};
