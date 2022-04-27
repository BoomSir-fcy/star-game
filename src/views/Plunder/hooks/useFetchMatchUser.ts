import { Api } from 'apis';
import { useTranslation } from 'contexts/Localization';
import { useToast } from 'contexts/ToastsContext';
import { useCallback, useState } from 'react';

const useFetchMatchUser = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Api.Alliance.PlunderInfoMatchUser | null>(
    null,
  );
  const [mineData, setMineData] =
    useState<Api.Alliance.PlunderInfoMatchUser | null>(null);
  const { toastError } = useToast();
  const { t } = useTranslation();

  // 1为自己的详情 2为随机一个掠夺用户的详情
  const fetch = useCallback(
    async (our: 1 | 2 = 2) => {
      setLoading(true);
      const res = await Api.AllianceApi.alliancePlunderInfo(our);
      setLoading(false);
      // 判断是否报错
      if (Api.isSuccess(res)) {
        // 判断是否有值
        if (res.data) {
          // 判断是否是自己
          if (our === 1) {
            setMineData(res.data);
          } else {
            setData(res.data);
          }
        } else {
          toastError(t('刷新失败, 请稍后重试'));
        }
      }
    },
    [setLoading, setData, toastError, t],
  );

  return {
    data,
    mineData,
    loading,
    fetch,
  };
};

export default useFetchMatchUser;
