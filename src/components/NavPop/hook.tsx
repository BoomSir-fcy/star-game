import { ethers } from 'ethers';
import { useERC20, useUserVaultContract } from 'hooks/useContract';
import { useCallback } from 'react';
import { getUserVaultAddress } from 'utils/addressHelpers';
import { RechargeToken } from 'utils/calls';
import { getBalanceNumber } from 'utils/formatBalance';
import multicall from 'utils/multicall';
import erc20Abi from 'config/abi/erc20.json';

// 充值、提现、授权
export const useRWA = (tokenAddress: string) => {
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

  return {
    Recharge,
    onApprove,
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
