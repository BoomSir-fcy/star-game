import useActiveWeb3React from 'hooks/useActiveWeb3React';
import useRefresh from 'hooks/useRefresh';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useStore } from 'state/util';
import {
  fetchAllianceViewAsync,
  fetchCombatRecordAsync,
  fetchExploreProgressAsync,
  setRecordLoad,
} from './reducer';

export const useFetchAllianceView = () => {
  const dispatch = useDispatch();
  const { account } = useActiveWeb3React();
  const { slowRefresh } = useRefresh();

  const fetch = useCallback(() => {
    if (account) {
      dispatch(fetchAllianceViewAsync());
    }
  }, [account, dispatch]);

  useEffect(() => {
    fetch();
  }, [fetch, slowRefresh]);

  return {
    fetch,
  };
};

export const useFetchExploreProgressView = () => {
  const dispatch = useDispatch();
  const { account } = useActiveWeb3React();
  const { slowRefresh } = useRefresh();

  const fetch = useCallback(() => {
    if (account) {
      dispatch(fetchExploreProgressAsync());
      // dispatch(fetchAllianceViewAsync());
    }
  }, [account, dispatch]);

  useEffect(() => {
    fetch();
  }, [fetch, slowRefresh]);

  return {
    fetch,
  };
};

export const useFetchCombatRecord = (start_time: number, end_time: number) => {
  const dispatch = useDispatch();
  const { account } = useActiveWeb3React();
  const fetch = useCallback(() => {
    if (account && start_time && end_time) {
      dispatch(setRecordLoad());
      dispatch(fetchCombatRecordAsync(account, start_time || 1, end_time));
    }
  }, [account, start_time, end_time, dispatch]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    fetch,
  };
};
