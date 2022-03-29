import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import random from 'lodash/random'
import { signMessage } from "utils/web3React";
import { Api } from "apis";
import { storage } from "config";
import { fetchUserInfoByAccountAsync } from "state/userInfo/reducer";

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
            dispatch(fetchUserInfoByAccountAsync(account)); // TODO: replace 1 for uid
          }
          console.log(res)
          return res || {
            code: -1
          }
        } catch (error: any) {
          console.error(error);
          return {
            code: error?.code || -1
          };
        }
      }
      return {
        code: -1,
      }
    },
    [library, account, dispatch]
  );

  return {
    handleLogin
  };
}