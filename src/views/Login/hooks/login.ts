import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import random from 'lodash/random'
import { signMessage } from "utils/web3React";
import { Api } from "apis";
import { storage } from "config";
import { fetchUserInfoByIdAsync } from "state/userInfo/reducer";

export const useLogin = () => {
  const { account, library } = useActiveWeb3React();
  const dispatch = useDispatch();

  const handleLogin = useCallback(
    async () => {
      if (account) {
        try {
          const sign = {
            nonce: `${random(0xFFFF, 0xFFFF_FFFF_FFFF)}`,
            timestamp: new Date().getTime(),
          };
          const signature = await signMessage(library, account, JSON.stringify(sign));
          const params = { ...sign, signature };
          const res = await Api.UserApi.userSignIn(params)
          if (Api.isSuccess(res)) {
            localStorage.setItem(storage.SSID, res.data.SSID);
            dispatch(fetchUserInfoByIdAsync(1)); // TODO: replace 1 for uid
          }
          console.log(res)
          return res
        } catch (error: any) {
          console.error(error);
          return {
            code: error?.code || 0
          };
        }
      }
      return {
        code: 0,
      }
    },
    [library, account, dispatch]
  );

  return {
    handleLogin
  };
}