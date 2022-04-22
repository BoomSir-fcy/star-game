import { ethers } from 'ethers';
import { useERC20, useUserVaultContract } from 'hooks/useContract';
import { useCallback } from 'react';
import { getUserVaultAddress } from 'utils/addressHelpers';
import { RechargeToken } from 'utils/calls';
import { getBalanceNumber } from 'utils/formatBalance';
import multicall from 'utils/multicall';
import erc20Abi from 'config/abi/erc20.json';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import random from 'lodash/random';
import { signMessage } from 'utils/web3React';
import { Api } from 'apis';

// 充值、提现、授权
export const useRWA = (tokenAddress: string) => {
  const { account, chainId, library } = useActiveWeb3React();

  const TokenContract = useERC20(tokenAddress);
  const UserVaultAddress = getUserVaultAddress();
  const UserVaultContract = useUserVaultContract();

  // 充值
  const Recharge = useCallback(
    async (address, amount, ChainToken = false) => {
      await RechargeToken(UserVaultContract, address, amount, ChainToken);
    },
    [UserVaultContract],
  );

  // 授权
  const onApprove = useCallback(async () => {
    const tx = await TokenContract.approve(
      UserVaultAddress,
      ethers.constants.MaxUint256,
    );
    const receipt = await tx.wait();
    return receipt.status;
  }, [TokenContract, UserVaultAddress]);

  // 提现
  const drawCallback = useCallback(
    async (drawAmount: string, drawTokenAddress: string) => {
      if (account) {
        try {
          const sign = {
            nonce: `${random(0xffff_ffff, 0xffff_ffff_ffff)}`,
            timestamp: new Date().getTime(),
            coin: drawTokenAddress,
            amount: Number(drawAmount),
          };
          const res = await signMessage(library, account, JSON.stringify(sign));
          const params = { ...sign, signature: res };
          const response = await Api.BalanceApi.withdraw(params);
          if (Api.isSuccess(response)) {
            return response;
          }
          return (
            response || {
              code: -1,
            }
          );
        } catch (error: any) {
          return {
            code: error?.code || -1,
          };
        }
      }
      return {
        code: -1,
      };
    },
    [library, account],
  );

  return {
    Recharge,
    onApprove,
    drawCallback,
  };
};

// 获取授权数量
export const FetchApproveNum = async (
  account: string,
  TokenAddress: string,
) => {
  const UserVaultAddress = getUserVaultAddress();
  const calls = [
    {
      address: TokenAddress,
      name: 'allowance',
      params: [account, UserVaultAddress],
    },
  ];
  try {
    const [TokenApprovedNum] = await multicall(erc20Abi, calls);
    const data = getBalanceNumber(TokenApprovedNum);
    return data;
  } catch (error) {
    return 0;
  }
};
