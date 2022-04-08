import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { useGalaxyContract } from 'hooks/useContract';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GalaxyState } from 'state/types';
import { fetchAuction } from './fetchers';
import {
  fetchGalaxyListAsync,
  fetchGalaxyStarListAsync,
  fetchGetNftViewAsync,
} from './reducer';

export const useGalaxySelector = () => {
  const galaxy = useSelector((state: { galaxy: GalaxyState }) => state.galaxy);
  return galaxy;
};

export const useGalaxyList = () => {
  const dispatch = useDispatch();
  const { account } = useActiveWeb3React();
  const { galaxyList } = useGalaxySelector();

  useEffect(() => {
    if (account && !galaxyList.length) {
      dispatch(fetchGalaxyListAsync());
    }
  }, [account, galaxyList, dispatch]);
};

export const useGalaxyStarList = (galaxyId: number) => {
  const dispatch = useDispatch();
  const { account } = useActiveWeb3React();
  const { galaxyStarList } = useGalaxySelector();

  useEffect(() => {
    if (account && !galaxyStarList.length) {
      dispatch(fetchGalaxyStarListAsync(galaxyId));
    }
  }, [galaxyId, account, galaxyStarList, dispatch]);
};

export const useGalaxyNft = (tokenId: number) => {
  const dispatch = useDispatch();
  const { account } = useActiveWeb3React();

  useEffect(() => {
    if (account && tokenId) {
      dispatch(fetchGetNftViewAsync(tokenId));
    }
  }, [account, tokenId, dispatch]);
};

// 竞拍
export const useAuction = () => {
  const contract = useGalaxyContract();
  const onAuction = useCallback(
    async (tokenId: number, price: string) => {
      try {
        const tx = await contract.buy(tokenId, { value: price });
        const receipt = await tx.wait();
        return receipt.status;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    [contract],
  );

  return { onAuction };
};
