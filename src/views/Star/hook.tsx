import { useCallback } from 'react';
import { usePlanetContract } from 'hooks/useContract';

export const useJoinAlliance = () => {
  const PlanetContract = usePlanetContract();
  // 充值
  const SetWorking = useCallback(
    async id => {
      // try {
      //   const tx = await PlanetContract.setWorking(id);
      //   const receipt = await tx.wait();
      //   return receipt.status;
      // } catch (e) {
      //   throw e;
      // }
    },
    [PlanetContract],
  );
  return { SetWorking };
};
