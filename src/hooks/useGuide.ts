import React from 'react';
import { Api } from 'apis';

export const useGuide = (url: string) => {
  const [guides, setGuides] = React.useState({
    step: 0,
    guideFinish: false,
    finish: false,
  });

  const getGuide = React.useCallback(async () => {
    try {
      const res = await Api.GuideApi.getGuide({ url });
      if (Api.isSuccess(res)) {
        // Todo 这里可以做一些处理
        setTimeout(() => {
          setGuides({
            step: res.data.step,
            guideFinish: res.data.finish,
            finish: true,
          });
        }, 500);
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }, [url]);

  const setGuide = React.useCallback(
    async (step: number, finish?: boolean) => {
      try {
        const res = await Api.GuideApi.setGuide({ url, step, finish });
        return res;
      } catch (error: any) {
        throw new Error(error);
      }
    },
    [url],
  );

  React.useEffect(() => {
    if (url) {
      getGuide();
    }
  }, [getGuide, url]);

  return {
    guides,
    setGuide,
  };
};
