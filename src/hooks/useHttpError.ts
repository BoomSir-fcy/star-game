import { useCallback } from 'react';
import { useTranslation } from 'contexts/Localization';
import { useToast } from 'contexts/ToastsContext';

import translations from 'config/localization/translations.json';

const httpErrorCodes = (() => {
  const codes: any[] = [];
  Object.keys(translations).forEach(item => {
    if (item.includes('http-error-')) {
      codes.push(Number(item.split('http-error-')[1]));
    }
  });

  return codes;
})();

// modified from https://usehooks.com/useDebounce/
export default function useHttpError() {
  const { toastError } = useToast();
  const { t } = useTranslation();

  const httpErrorToast = useCallback(
    (data: Api.Error) => {
      if (httpErrorCodes.includes(data.code)) {
        toastError(t(`http-error-${data.code}`));
      } else {
        toastError(t('http-error-network'));
      }
    },
    [t, toastError],
  );

  return httpErrorToast;
}

export function useNetworkError() {
  const { toastError } = useToast();
  const { t } = useTranslation();

  const networkErrorToast = useCallback(() => {
    toastError(t('http-error-network'));
  }, [t, toastError]);

  return networkErrorToast;
}
