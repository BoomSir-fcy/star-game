// import { ChainId } from 'dsgswap-sdk'
import { ChainId, } from 'config/wallet/config';

import addresses from 'config/constants/contracts'
// import { Address } from 'config/constants/types'

export const getAddress = (address: any): string => {
  const chainId = process.env.REACT_APP_CHAIN_ID
  return address[chainId] ? address[chainId] : address[ChainId.MAINNET]
}

export const getMulticallAddress = () => {
  return getAddress(addresses.multiCall)
}
