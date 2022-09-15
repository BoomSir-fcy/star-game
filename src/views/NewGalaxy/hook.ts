import pako from 'pako';
import { Api } from 'apis';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import random from 'lodash/random';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPKInfo, setPKisFrom, setPKRes } from 'state/game/reducer';
import { signMessage } from 'utils/web3React';
import { parseZip } from 'utils';
import { fetchGalaxyStarListAsync } from 'state/galaxy/reducer';
import { useToast } from 'contexts/ToastsContext';
import { useTranslation } from 'contexts/Localization';

const usePlunder = () => {
  const { account, library } = useActiveWeb3React();
  const dispatch = useDispatch();
  const { toastSuccess } = useToast();
  const { t } = useTranslation();

  const handlePlunder = useCallback(
    async (starInfo: any): Promise<boolean> => {
      if (account) {
        try {
          const sign = {
            nonce: `${random(0xffff, 0xffff_ffff_ffff)}`,
            timestamp: new Date().getTime(),
          };
          const signature = await signMessage(
            library,
            account,
            JSON.stringify(sign),
          );
          const params = { ...sign, signature, ...starInfo };
          const res = await Api.GalaxyApi.plunderStar(params);
          console.log(starInfo);
          dispatch(fetchGalaxyStarListAsync(starInfo.nft_id));
          if (Api.isSuccess(res)) {
            // dispatch(setPKInfo(res.data.pk_result1[0]));
            console.log(parseZip(res.data.pk_result));
            const pkRes = parseZip(res.data.pk_result);
            if (!pkRes) {
              toastSuccess(t('Occupy Succeeded'));
              return false;
            }
            dispatch(setPKInfo(pkRes));
            dispatch(setPKRes(res.data?.success));
            dispatch(setPKisFrom(true));
            return true;
          }
        } catch (error) {
          return false;
        }
      }
      return false;
    },
    [account, library, dispatch, t, toastSuccess],
  );
  const handleGiveup = useCallback(
    async (starInfo: any): Promise<boolean> => {
      if (account) {
        try {
          const sign = {
            nonce: `${random(0xffff, 0xffff_ffff_ffff)}`,
            timestamp: new Date().getTime(),
          };
          const signature = await signMessage(
            library,
            account,
            JSON.stringify(sign),
          );
          const params = { ...sign, signature, ...starInfo };
          const res = await Api.GalaxyApi.giveupStar(params);
          if (Api.isSuccess(res)) {
            return true;
          }
        } catch (error) {
          return false;
        }
      }
      return false;
    },
    [account, library],
  );
  return {
    handlePlunder,
    handleGiveup,
  };
};

export default usePlunder;
