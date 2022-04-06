import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useWeb3React } from '@web3-react/core';
import useAuth from 'hooks/useAuth';
import { useFetchUserInfo } from 'state/userInfo/hooks';
import { fetchUserInfoByAccountAsync } from 'state/userInfo/reducer';

export default function AccountUpdater() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [accountFlag, setAccountFlag] = useState('');
  const { account } = useWeb3React();
  const { pathname } = useLocation();

  useFetchUserInfo();

  useEffect(() => {
    if (account) {
      dispatch(fetchUserInfoByAccountAsync(account)); // TODO: replace 1 for uid
    }
  }, [dispatch, account]);

  useEffect(() => {
    if (!account) {
      // navigate('/login', { replace: true });
    }
  }, [account, navigate]);

  return null;
}
