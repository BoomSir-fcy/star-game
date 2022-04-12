import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useWeb3React } from '@web3-react/core';
import { useFetchUserInfo } from 'state/userInfo/hooks';
import { fetchUserInfoByAccountAsync } from 'state/userInfo/reducer';
import { storage } from 'config';
import { useStore } from 'state';

export default function AccountUpdater() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [accountFlag, setAccountFlag] = useState('');
  const { account } = useWeb3React();
  const userInfo = useStore(p => p.userInfo.userInfo);

  useFetchUserInfo();

  // 重置用户信息
  const handleReSetAccount = useCallback(() => {
    localStorage.removeItem(storage.SSID);
    navigate('/', { replace: true });
  }, [dispatch]);

  useEffect(() => {
    if (account) {
      dispatch(fetchUserInfoByAccountAsync(account));
    }
  }, [account]);

  useEffect(() => {
    // 如果钱包地址不一样退出
    if (
      userInfo.address &&
      account &&
      account?.toLowerCase() !== userInfo.address
    ) {
      handleReSetAccount();
    }
  }, [account, userInfo, handleReSetAccount]);

  useEffect(() => {
    if (account && !accountFlag) {
      setAccountFlag(account);
      return;
    }
    if (account && accountFlag && accountFlag !== account) {
      setAccountFlag(account);
      handleReSetAccount();
    }
  }, [account, handleReSetAccount, accountFlag]);

  return null;
}
