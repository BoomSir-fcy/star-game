/* eslint-disable */

import { useCallback } from 'react';
import { usePlanetContract } from 'hooks/useContract';
import { Api } from 'apis';
import useActiveWeb3React from 'hooks/useActiveWeb3React';

export const useJoinAlliance = () => {
  const PlanetContract = usePlanetContract();
  const { account } = useActiveWeb3React();

  // 充值
  const SetWorking = useCallback(
    async (planet_id, arr) => {
      try {
        const res = await Api.PlanetApi.getPlanetCaWork({ planet_id });
        if (Api.isSuccess(res)) {
          console.log(res);
          if (res.data.success) {
            try {
              const tx = await PlanetContract.setWorking(arr);
              const receipt = await tx.wait();
              return receipt.status;
            } catch (e) {
              throw e;
            }
          }
        }
      } catch (error) {
        throw error;
      }
    },
    [PlanetContract, account],
  );
  return { SetWorking };
};
