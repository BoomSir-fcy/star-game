import React, { useEffect, useCallback } from 'react';
import useHttpError, { useNetworkError } from 'hooks/useHttpError';

import eventBus from 'utils/eventBus';
import { useLocation, useNavigate } from 'react-router-dom';
import { storage } from 'config';

export default function HttpUpdater() {
  const httpErrorToast = useHttpError();
  const networkErrorToast = useNetworkError();

  const { pathname } = useLocation();
  const navigate = useNavigate();

  // http 错误码提示
  const handleHttpError = useCallback(
    error => {
      httpErrorToast(error.data);
    },
    [httpErrorToast],
  );

  useEffect(() => {
    eventBus.addEventListener('httpError', handleHttpError);
    return () => {
      eventBus.removeEventListener('httpError', handleHttpError);
    };
  }, [handleHttpError]);

  useEffect(() => {
    eventBus.addEventListener('networkerror', networkErrorToast);
    return () => {
      eventBus.removeEventListener('networkerror', networkErrorToast);
    };
  }, [networkErrorToast]);

  // 重置用户信息
  const handleReSetAccount = useCallback(() => {
    if (pathname !== '/login') {
      localStorage.removeItem(storage.SSID);
      // dispatch(storeAction.resetLoginState());
      navigate('/', { replace: true });
    }
  }, [pathname, navigate]);

  useEffect(() => {
    eventBus.addEventListener('unauthorized', handleReSetAccount);
    return () => {
      eventBus.removeEventListener('unauthorized', handleReSetAccount);
    };
  }, [handleReSetAccount]);

  return <></>;
}
