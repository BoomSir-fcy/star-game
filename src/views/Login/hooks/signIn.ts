import { useUserAgentContract } from 'hooks/useContract';
import { useCallback } from 'react';
import { getStringOfBold } from 'utils';
import { CheckNickNameState } from '../types';

export const useCheckName = () => {
  const contract = useUserAgentContract();

  const handleCheck = useCallback(
    async name => {
      if (!name) return CheckNickNameState.NULL_NAME;
      const len = getStringOfBold(name);
      if (len < 6) return CheckNickNameState.SHORT_NAME;
      if (len > 30) return CheckNickNameState.LONG_NAME;
      const res = await contract.checkNickname(name);
      return res
        ? CheckNickNameState.EXACT_NAME
        : CheckNickNameState.BAD_NAME_WITH_CONTRACT;
    },
    [contract],
  );
  return {
    handleCheck,
  };
};

interface RegisterParams {
  nickname: string;
  superior: string;
  payType: string;
  BNB_price: string;
  gender: 0 | 1;
}
export const useRegisterWithDsg = () => {
  const contract = useUserAgentContract();

  /**
   * @dev 使用dsg注册
   * @param nickname 昵称
   * @param superior 邀请人
   * @param gender 性别 0.男 1.女
   */
  const handleRegister = useCallback(
    async ({
      nickname,
      superior,
      gender,
      payType,
      BNB_price,
    }: RegisterParams) => {
      let tx;
      if (payType === 'BNB') {
        console.log(BNB_price);

        tx = await contract.registerWithBnb(nickname, superior, gender, {
          value: BNB_price,
        });
      } else {
        tx = await contract.registerWithDsg(nickname, superior, gender);
      }
      const receipt = await tx.wait();
      return receipt.status;
    },
    [contract],
  );

  return {
    handleRegister,
  };
};
