import pako from 'pako';
import { Api } from 'apis';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import random from 'lodash/random';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPKInfo } from 'state/game/reducer';
import { signMessage } from 'utils/web3React';
import { parseZip } from 'utils';

const usePlunder = () => {
  const { account, library } = useActiveWeb3React();
  const dispatch = useDispatch();

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
          if (Api.isSuccess(res)) {
            // dispatch(setPKInfo(res.data.pk_result1[0]));
            dispatch(setPKInfo(parseZip(res.data.pk_result)));
            return true;
          }
        } catch (error) {
          return false;
        }
      }
      return false;
    },
    [account, library, dispatch],
  );

  return {
    handlePlunder,
  };
};

export default usePlunder;
