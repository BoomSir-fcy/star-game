/* eslint-disable */

import { useCallback } from 'react';
import { usePlanetContract } from 'hooks/useContract';
import { Api } from 'apis';
import useActiveWeb3React from 'hooks/useActiveWeb3React';

export const useJoinAlliance = () => {
  const PlanetContract = usePlanetContract();
  const { account } = useActiveWeb3React();

  // 设置工作的星球
  const SetWorking = useCallback(
    async arr => {
      // try {
      //   const res = await Api.PlanetApi.getPlanetCaWork({ planet_id });
      //   if (Api.isSuccess(res)) {
      //     console.log(res);
      //     if (res.data.success) {

      //     }
      //   }
      // } catch (error) {
      //   throw error;
      // }

      try {
        const tx = await PlanetContract.setWorking(arr);
        const receipt = await tx.wait();
        return receipt.status;
      } catch (e) {
        throw e;
      }
    },
    [PlanetContract, account],
  );
  return { SetWorking };
};
