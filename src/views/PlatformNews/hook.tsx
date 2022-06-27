import { useWeb3React } from '@web3-react/core';
import { useCallback, useEffect, useState } from 'react';
import { Api } from 'apis';

export const useFetchMessageList = () => {
  const { account } = useWeb3React();
  const [list, setList] = useState([]);
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
        const temp = res.data.list;
        const nowList = page === 1 ? temp : [...list, ...temp];
        if (page * pageSize >= res.data.count) {
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
