import { ChainId } from 'dsgswap-sdk'
import addresses from 'config/constants/contracts'
import tokens from 'config/constants/tokens'
import { Address } from 'config/constants/types'

export const getAddress = (address: Address): string => {
  const chainId = process.env.REACT_APP_CHAIN_ID
  return address[chainId] ? address[chainId] : address[ChainId.MAINNET]
}

export const getDsgAddress = () => {
  return getAddress(tokens.dsg.address)
}
export const getCakeAddress = () => {
  return getAddress(tokens.cake.address)
}
export const getMasterChefAddress = () => {
  return getAddress(addresses.masterChef)
}
export const getMulticallAddress = () => {
  return getAddress(addresses.multiCall)
}
export const getWbnbAddress = () => {
  return getAddress(tokens.wbnb.address)
}
export const getCakeVaultAddress = () => {
  return getAddress(addresses.cakeVault)
}
export const getTradingPoolAddress = () => {
  return getAddress(addresses.tradingPool)
}
export const getAggregatorAddress = () => {
  return getAddress(addresses.aggregator)
}
export const getLiquidityPoolAddress = () => {
  return getAddress(addresses.liquidityPool)
}
export const getVDSGTokenAddress = () => {
  return getAddress(addresses.vDSGToken)
}
export const getNftEarnErc20PoolAddress = () => {
  return getAddress(addresses.NftEarnErc20Pool)
}
export const getNftEarnErc20PoolV1Address = () => {
  return getAddress(addresses.NftEarnErc20PoolV1)
}
export const getErc20EarnNftPoolAddress = () => {
  return getAddress(addresses.Erc20EarnNftPool)
}
export const getNftMarketAddress = () => {
  return getAddress(addresses.nftMarket)
}
export const getSocialInviteAddress = () => {
  return getAddress(addresses.socialInvitation)
}
export const getFFragmentPoolAddress = () => {
  return getAddress(addresses.FFragmentPool)
}
export const getYCFragmentPoolAddress = () => {
  return getAddress(addresses.YCFragmentPool)
}
export const getTFragmentPoolAddress = () => {
  return getAddress(addresses.TFragmentPool)
}
export const getAFragmentPoolAddress = () => {
  return getAddress(addresses.TicketFragmentPool)
}
export const getIncentivePoolAddress = () => {
  return getAddress(addresses.IncentivePool)
}
export const getV1FarmPoolAddress = () => {
  return getAddress(addresses.liquidityV1Pool)
}
export const getMysteryBoxAddress = () => {
  return getAddress(addresses.MysteryBox)
}
export const getDsgFoodNftAddress = () => {
  return getAddress(addresses.DsgFoodNft)
}
export const getDsgTriceratopsNft = () => {
  return getAddress(addresses.DsgTriceratopsNft)
}
export const getDsgAvatarNftAddress = () => {
  return getAddress(addresses.ExPhotoNft)
}
export const getTicketNftAddress = () => {
  return getAddress(addresses.ticketsPhotoNft)
}
export const getYCTicketNftAddress = () => {
  return getAddress(addresses.MonekeyDABNft)
}
export const getOracleAddress = () => {
  return getAddress(addresses.oracle)
}
export const getSinglePoolFactoryAddress = () => {
  return getAddress(addresses.SinglePoolFactory)
}
export const getExPhotoAddress = () => {
  return getAddress(addresses.ExPhoto)
}
export const getExPhotoNftAddress = () => {
  return getAddress(addresses.ExPhotoNft)
}
export const getTimeShopAddress = () => {
  return getAddress(addresses.TimeShop);
};
export const getTimeAddress = () => {
  return getAddress(addresses.TimeToken);
};
export const getMutiRewardPoolAddress = () => {
  return getAddress(addresses.MutiRewardPool);
};