import useActiveWeb3React from "hooks/useActiveWeb3React"
import { useCallback, useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useStore } from "state/util";
import { fetchAllowanceAsync, fetchInfoViewAsync, fetchUserViewAsync } from "./reducer";

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
  const { account } = useActiveWeb3React();

  useEffect(() => {
    if (account) {
      dispatch(fetchInfoViewAsync(account))
    }
  }, [dispatch, account])
}

export const useFetchAllowance = () => {
  const infoView = useStore(p => p.userInfo.infoView)
  const dispatch = useDispatch();
  const { account } = useActiveWeb3React();
  
  console.log(account && infoView.payToken_, 'infoView')
  const fetch = useCallback(() => {
    if (account && infoView.payToken_) {
      console.log(21121212)
      dispatch(fetchAllowanceAsync({ account, token: infoView.payToken_ }))
    }
  }, [dispatch, infoView.payToken_, account])

  useEffect(() => {
    fetch()
  }, [fetch])
  return {
    fetch,
  }
}