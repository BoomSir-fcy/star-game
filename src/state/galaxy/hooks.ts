import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GalaxyState } from 'state/types';
import { fetchGalaxyListAsync, fetchGalaxyStarListAsync } from './reducer';

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
  const { galaxyStarList, currentGalaxy } = useGalaxySelector();

  useEffect(() => {
    if (account && currentGalaxy.id !== galaxyId && !galaxyStarList.length) {
      dispatch(fetchGalaxyStarListAsync(galaxyId));
    }
  }, [galaxyId, currentGalaxy, account, galaxyStarList, dispatch]);
};
