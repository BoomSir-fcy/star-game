import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { useGalaxyContract } from 'hooks/useContract';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GalaxyInfo, GalaxyState } from 'state/types';
import {
  fetchAllLogsAsync,
  fetchGalaxReportListAsync,
  fetchGalaxyListAsync,
  fetchGalaxyStarListAsync,
  fetchGetNftViewAsync,
  fetchGetNftViewListAsync,
  fetchOwnerInfoAsync,
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
    if (account) {
      dispatch(fetchGalaxyListAsync());
    }
  }, [account, dispatch]);
};

export const useGalaxyStarList = (galaxyId: number) => {
  const dispatch = useDispatch();
  const { account } = useActiveWeb3React();
  const { galaxyStarList } = useGalaxySelector();

  useEffect(() => {
    if (account) {
      dispatch(fetchGalaxyStarListAsync(galaxyId));
    }
  }, [galaxyId, account, dispatch]);
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

export const useGalaxyNftArr = (List: GalaxyInfo[]) => {
  const dispatch = useDispatch();
  const { account } = useActiveWeb3React();

  useEffect(() => {
    if (account && List.length) {
      dispatch(fetchGetNftViewListAsync(List));
    }
  }, [account, List, dispatch]);
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
        throw error;
      }
    },
    [contract],
  );

  return { onAuction };
};

export const useFetchAllLogsView = () => {
  const dispatch = useDispatch();
  const { account } = useActiveWeb3React();
  const fetch = useCallback(() => {
    if (account) {
      dispatch(fetchAllLogsAsync());
    }
  }, [account, dispatch]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    fetch,
  };
};

export const useFetchOwnerInfo = (nft_id: number) => {
  const dispatch = useDispatch();
  const { account } = useActiveWeb3React();
  const fetch = useCallback(() => {
    if (account) {
      dispatch(fetchOwnerInfoAsync(nft_id));
    }
  }, [account, nft_id, dispatch]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    fetch,
  };
};

export const useFetchGalaxReportList = (
  start_time: number,
  end_time: number,
) => {
  const dispatch = useDispatch();
  const { account } = useActiveWeb3React();
  const fetch = useCallback(() => {
    if (account && start_time && end_time) {
      dispatch(fetchGalaxReportListAsync(start_time || 1, end_time));
    }
  }, [account, start_time, end_time, dispatch]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    fetch,
  };
};
