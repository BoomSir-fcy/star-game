import { ethers } from 'ethers';
import { useERC20 } from 'hooks/useContract';
import { useCallback } from 'react';
import { getUserAgentAddress } from 'utils/addressHelpers';

export const useApprove = (token: string, spender: string) => {
  const contract = useERC20(token);

  const handleApprove = useCallback(async () => {
    const tx = await contract.approve(spender, ethers.constants.MaxUint256);
    const receipt = await tx.wait();
    return receipt.status;
    // try {
    // } catch (e) {
    //   return false;
    // }
  }, [contract, spender]);

  return { onApprove: handleApprove };
};
