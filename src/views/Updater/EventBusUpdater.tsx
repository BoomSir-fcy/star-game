import React, { useEffect, useCallback } from 'react';
import useHttpError, { useNetworkError } from 'hooks/useHttpError';

import eventBus from 'utils/eventBus';

export default function HttpUpdater() {
  const httpErrorToast = useHttpError();
  const networkErrorToast = useNetworkError();

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

  return <></>;
}
