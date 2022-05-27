import { useWeb3React } from '@web3-react/core';
import { useCallback, useEffect, useState } from 'react';
import { Api } from 'apis';

export const useFetchCombatRecord = () => {
  const { account } = useWeb3React();
  const [list, setList] = useState([]);
  const [page, setPageNum] = useState<number>(1);
  const [page_size, setPageSize] = useState<number>(6);
  const [end, setEnd] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [WinCont, setWinCont] = useState(0);
  const [FailedCont, setFailedCont] = useState(0);
  const [Cont, setCont] = useState(0);

  // eslint-disable-next-line
  const getList = async (address: string, Page: number) => {
    setLoading(true); // 设为请求状态
    try {
      const res = await Api.AllianceApi.getMyCombatRecord({
        address,
        page: Page,
        page_size,
      });
      if (Api.isSuccess(res)) {
        const temp = res.data.record;
        const nowList = Page === 1 ? temp : [...list, ...temp];
        if (Page * page_size >= res.data.count) {
          setEnd(true);
        }
        setWinCont(res.data.win_count);
        setFailedCont(res.data.failed_count);
        setCont(res.data.count);
        setList(nowList);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // 请求完毕置为false
    }
  };
  useEffect(() => {
    getList(account, page);
    // eslint-disable-next-line
  }, [account, page]);

  return { list, page, end, setPageNum, Cont, WinCont, FailedCont, loading };
};
