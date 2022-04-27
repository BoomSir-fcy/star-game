import Game from 'game/core/Game';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useStore } from 'state/util';
import {
  fetchGameMatchUser,
  fetchGamePK,
  fetchGamePKTest,
  fetchGamePlunderPk,
} from './fetchers';
import {
  fetchUnitListAsync,
  fetchGamePlanetUnitsAsync,
  fetchGamePKAsync,
  fetchGamePlanetUnitsTestAsync,
  fetchGamePKTestAsync,
  fetchGameterrainAsync,
  fetchGamePlunderPkAsync,
  fetchGameMatchUserAsync,
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

export const useFetchGamePlanetUnitsTest = (id: number) => {
  const dispatch = useDispatch();
  const fetch = useCallback(() => {
    dispatch(fetchGamePlanetUnitsTestAsync(id));
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
    if (id0 && id1 && id0 !== id1) {
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

export const useFetchGamePKTest = (
  id0?: number,
  id1?: number,
  maxRound?: number,
  terrain_id?: number,
) => {
  const dispatch = useDispatch();
  const fetch = useCallback(() => {
    if (id0 && !id1) {
      dispatch(fetchGamePKTestAsync(`t-${id0}`, maxRound, terrain_id));
    }
  }, [dispatch, id0, id1, maxRound, terrain_id]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    fetch,
  };
};

export const useFetchGameMatchUser = () => {
  const dispatch = useDispatch();
  const fetch = useCallback(
    (out?: 1 | 2) => {
      dispatch(fetchGameMatchUserAsync(out));
    },
    [dispatch],
  );

  useEffect(() => {
    fetch(1);
    fetch();
  }, [fetch]);

  return {
    fetch,
  };
};

export const useFetchGamePkInfo = () => {
  const dispatch = useDispatch();
  const fetch = useCallback(() => {
    dispatch(fetchGamePlunderPkAsync());
  }, [dispatch]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    fetch,
  };
};

export const useFetchGameTerrain = () => {
  const dispatch = useDispatch();
  const fetch = useCallback(() => {
    dispatch(fetchGameterrainAsync());
  }, [dispatch]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    fetch,
  };
};
