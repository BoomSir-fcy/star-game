import useActiveWeb3React from "hooks/useActiveWeb3React"
import { useCallback, useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useStore } from "state/util";
import { fetchUnitListAsync, fetchGamePlanetUnitsAsync } from "./reducer";

export const useFetchUnitList = () => {

  const dispatch = useDispatch();
  const fetch = useCallback(() => {
    dispatch(fetchUnitListAsync(1))
  }, [dispatch]);

  useEffect(() => {
    fetch()
  }, [fetch])

  return {
    fetch
  }
}

export const useFetchGamePlanetUnits = (id: number) => {

  const dispatch = useDispatch();
  const fetch = useCallback(() => {
    dispatch(fetchGamePlanetUnitsAsync(id))
  }, [dispatch, id]);

  useEffect(() => {
    fetch()
  }, [fetch])

  return {
    fetch
  }
}
