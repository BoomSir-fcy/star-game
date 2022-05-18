import React from 'react';
import { Api } from 'apis';

export const useGuide = (url: string) => {
  const [guides, setGuides] = React.useState({
    step: 0,
    finish: false,
  });

  const getGuide = React.useCallback(async () => {
    try {
      const res = await Api.GuideApi.getGuide({ url });
      if (Api.isSuccess(res)) {
        setGuides({
          step: res.data.step,
          finish: true,
        });
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }, [url]);

  const setGuide = React.useCallback(
    async (step: number) => {
      try {
        const res = await Api.GuideApi.setGuide({ url, step });
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