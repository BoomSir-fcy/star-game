import { ethers } from "ethers"
import { useERC20 } from "hooks/useContract"
import { useCallback } from "react"
import { getUserAgentAddress } from "utils/addressHelpers"

export const useApproveUserAgent = (address: string) => {

  const contract = useERC20(address)
  const userAgentAddress = getUserAgentAddress()

  const handleApprove = useCallback(async () => {
    try {
      const tx = await contract.approve(userAgentAddress, ethers.constants.MaxUint256)
      const receipt = await tx.wait()
      return receipt.status
    } catch (e) {
      return false
    }
  }, [contract, userAgentAddress])

  return { onApprove: handleApprove }
}