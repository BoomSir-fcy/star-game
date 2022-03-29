import { useMysteryBoxContract } from 'hooks/useContract';
import { useCallback, useEffect } from 'react';
import { getPlanetContract } from 'utils/contractHelpers';

export const useBuyMysteryBox = () => {
  const contract = useMysteryBoxContract();

  const handleBuy = useCallback(
    async (boxId: number, price: string) => {
      const tx = await contract.buy(boxId, { value: price });
      const receipt = await tx.wait();
      return receipt;
    },
    [contract],
  );

  return {
    handleBuy,
  };
};

export const useOpenMysteryBox = () => {
  const contract = useMysteryBoxContract();

  const handleOpen = useCallback(
    async (boxId: number, planetName: string) => {
      const tx = await contract.openBox(boxId, planetName, {});
      const receipt = await tx.wait();
      return receipt;
    },
    [contract],
  );

  return {
    handleOpen,
  };
};
