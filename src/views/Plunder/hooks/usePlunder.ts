import { Api } from 'apis';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import random from 'lodash/random';
import { useCallback } from 'react';
import { signMessage } from 'utils/web3React';

const usePlunder = () => {
  const { account, library } = useActiveWeb3React();

  const handlePlunder = useCallback(async (address: string) => {
    if (account) {
      const sign = {
        to_address: address,
        nonce: `${random(0xffff, 0xffff_ffff_ffff)}`,
        timestamp: new Date().getTime(),
      };
      const signature = await signMessage(
        library,
        account,
        JSON.stringify(sign),
      );
      const params = { ...sign, signature };
      // const res = await Api.UserApi.userSignIn(params);
    }
  }, []);
};

export default usePlunder;
