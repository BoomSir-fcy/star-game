import { usePlanetContract } from 'hooks/useContract';
import { useCallback } from 'react';

// 星球升级
export const useUpgrade = () => {
  const contract = usePlanetContract();

  const handleUpgrade = useCallback(
    async (planetId: number, materialIds: number[] | string[]) => {
      try {
        const tx = await contract.upgradePlanet(planetId, materialIds);
        const receipt = await tx.wait();
        return receipt.status;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    [contract],
  );

  return { upgrade: handleUpgrade };
};
