import Game from 'game/core/Game';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useStore } from 'state/util';
import { fetchGamePK } from './fetchers';
import {
  fetchUnitListAsync,
  fetchGamePlanetUnitsAsync,
  fetchGamePKAsync,
} from './reducer';

export const useFetchUnitList = (race?: Api.Game.race) => {
  const dispatch = useDispatch();
  const fetch = useCallback(() => {
    if (race) {
      dispatch(fetchUnitListAsync(race));
    }
  }, [dispatch, race]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    fetch,
  };
};

export const useFetchGamePlanetUnits = (id: number) => {
  const dispatch = useDispatch();
  const fetch = useCallback(() => {
    dispatch(fetchGamePlanetUnitsAsync(id));
  }, [dispatch, id]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    fetch,
  };
};

export const useFetchGamePK = (
  id0?: number,
  id1?: number,
  maxRound?: number,
) => {
  const dispatch = useDispatch();
  const fetch = useCallback(() => {
    if (id0 && id1) {
      dispatch(fetchGamePKAsync(id0, id1, maxRound));
    }
  }, [dispatch, id0, id1, maxRound]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    fetch,
  };
};
