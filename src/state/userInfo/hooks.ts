import useActiveWeb3React from 'hooks/useActiveWeb3React';
import useRefresh from 'hooks/useRefresh';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useStore } from 'state/util';
import {
  fetchAllowanceAsync,
  fetchInfoViewAsync,
  fetchUserBalanceAsync,
  fetchUserProductAsync,
  fetchUserViewAsync,
} from './reducer';

export const useFetchUserInfo = () => {
  const dispatch = useDispatch();
  const { account } = useActiveWeb3React();
  const fetch = useCallback(() => {
    if (account) {
      dispatch(fetchUserViewAsync(account));
    }
  }, [account, dispatch]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    fetch,
  };
};

export const useFetchInfoView = () => {
  const dispatch = useDispatch();
  const { account } = useActiveWeb3React();

  useEffect(() => {
    if (account) {
      dispatch(fetchInfoViewAsync(account));
    }
  }, [dispatch, account]);
};

export const useFetchAllowance = () => {
  const infoView = useStore(p => p.userInfo.infoView);
  const dispatch = useDispatch();
  const { account } = useActiveWeb3React();

  const fetch = useCallback(() => {
    if (account && infoView.payToken_) {
      dispatch(fetchAllowanceAsync({ account, token: infoView.payToken_ }));
    }
  }, [dispatch, infoView.payToken_, account]);

  useEffect(() => {
    fetch();
  }, [fetch]);
  return {
    fetch,
  };
};

export const useFetchUserBalance = () => {
  const dispatch = useDispatch();
  const { account } = useActiveWeb3React();
  const { slowRefresh } = useRefresh();
  const location = useLocation();

  const fetch = useCallback(() => {
    if (account) {
      dispatch(fetchUserBalanceAsync());
    }
  }, [account, dispatch]);

  useEffect(() => {
    fetch();
  }, [fetch, slowRefresh, location.pathname]);

  return {
    fetch,
  };
};

export const useFetchUserProduct = () => {
  const dispatch = useDispatch();
  const { account } = useActiveWeb3React();
  const { slowRefresh } = useRefresh();
  const location = useLocation();

  const fetch = useCallback(() => {
    if (account) {
      dispatch(fetchUserProductAsync());
    }
  }, [account, dispatch]);

  useEffect(() => {
    fetch();
  }, [fetch, slowRefresh, location.pathname]);

  return {
    fetch,
  };
};
