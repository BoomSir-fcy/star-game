import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useStore } from 'state/util';
import { fetchBoxViewAsync, fetchUserKeysAsync } from './reducer';

export const useFetchBoxView = () => {
  const dispatch = useDispatch();
  const { account } = useActiveWeb3React();
  const fetch = useCallback(() => {
    if (account) {
      dispatch(fetchBoxViewAsync(account));
      dispatch(fetchUserKeysAsync(account));
    }
  }, [account, dispatch]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    fetch,
  };
};
