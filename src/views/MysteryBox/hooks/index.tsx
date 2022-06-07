import BigNumber from 'bignumber.js';
import { useMysteryBoxContract } from 'hooks/useContract';
import { useCallback, useEffect } from 'react';
import { getPlanetContract } from 'utils/contractHelpers';

export const useBuyMysteryBox = () => {
  const contract = useMysteryBoxContract();

  const handleBuy = useCallback(
    async (boxId: number, price: string, buyNum: number) => {
      const tx = await contract.buy(boxId, buyNum, {
        value: new BigNumber(price).times(buyNum).toString(),
      });
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
    async (boxId: number, planetName: string, buyNum?: number) => {
      const tx = await contract.openBox(boxId, planetName, buyNum, {});
      const receipt = await tx.wait();
      return receipt;
    },
    [contract],
  );

  return {
    handleOpen,
  };
};
