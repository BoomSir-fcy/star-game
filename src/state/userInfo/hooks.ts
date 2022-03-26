import useActiveWeb3React from "hooks/useActiveWeb3React"
import { useCallback, useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchInfoViewAsync, fetchUserViewAsync } from "./reducer";

export const useFetchUserInfo = () => {

  const dispatch = useDispatch();
  const { account } = useActiveWeb3React();
  const fetch = useCallback(() => {
    if (account) {
      dispatch(fetchUserViewAsync(account))
    }
  }, [account, dispatch]);

  useEffect(() => {
    fetch()
  }, [fetch])

  return {
    fetch
  }
}

export const useFetchInfoView = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchInfoViewAsync())
  }, [dispatch])
}
