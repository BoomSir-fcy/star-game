import BigNumber from 'bignumber.js';
import { useMysteryBoxContract } from 'hooks/useContract';
import { useCallback, useEffect } from 'react';
import { getMysteryBoxAddress } from 'utils/addressHelpers';
import { getBep20Contract, getPlanetContract } from 'utils/contractHelpers';
import { getBalanceNumber } from 'utils/formatBalance';

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

  const handleBuyWithStkBnb = useCallback(
    async (boxId: number, buyNum: number) => {
      const tx = await contract.buyWithStkBnb(boxId, buyNum);
      const receipt = await tx.wait();
      return receipt;
    },
    [contract],
  );

  return {
    handleBuy,
    handleBuyWithStkBnb,
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

export const useFetchAllowance = () => {
  const MysteryBoxAddress = getMysteryBoxAddress();

  const fetchAllowance = useCallback(
    async (account: string, token: string) => {
      try {
        const erc20Contract = getBep20Contract(token);
        const allowance = await erc20Contract.allowance(
          account,
          MysteryBoxAddress,
        );
        return getBalanceNumber(new BigNumber(allowance.toJSON().hex));
      } catch (error) {
        console.error(error);
        return 0;
      }
    },
    [MysteryBoxAddress],
  );

  return {
    fetchAllowance,
  };
};
