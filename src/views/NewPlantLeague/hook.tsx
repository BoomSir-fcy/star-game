/* eslint-disable */
import { useCallback } from 'react';
import { usePlanetContract } from 'hooks/useContract';
import { Api } from 'apis';
import useActiveWeb3React from 'hooks/useActiveWeb3React';

export const useRemoveAlliance = () => {
  const PlanetContract = usePlanetContract();
  const { account } = useActiveWeb3React();

  // 设置工作的星球
  const RemoveStar = useCallback(
    async arr => {
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
  return { RemoveStar };
};
