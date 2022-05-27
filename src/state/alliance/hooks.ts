import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useStore } from 'state/util';
import { fetchAllianceViewAsync, fetchCombatRecordAsync } from './reducer';

export const useFetchAllianceView = () => {
  const dispatch = useDispatch();
  const { account } = useActiveWeb3React();
  const fetch = useCallback(() => {
    if (account) {
      dispatch(fetchAllianceViewAsync());
    }
  }, [account, dispatch]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    fetch,
  };
};

export const useFetchCombatRecord = (page: number, page_size: number) => {
  const dispatch = useDispatch();
  const { account } = useActiveWeb3React();
  const fetch = useCallback(() => {
    if (account && page_size) {
      dispatch(fetchCombatRecordAsync(account, page || 1, page_size));
    }
  }, [account, page, page_size, dispatch]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    fetch,
  };
};
