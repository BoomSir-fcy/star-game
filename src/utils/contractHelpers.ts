import { ethers } from 'ethers'
import { simpleRpcProvider } from 'utils/providers'

// Addresses
import {
  getAddress,
  getMulticallAddress,
  getUserAgentAddress,
  getMysteryBoxAddress,
  getGalaxyAddress,
  getPlanetAddress,
  getUserVaultAddress,
} from 'utils/addressHelpers'

// ABI
import bep20Abi from 'config/abi/erc20.json'
import erc721Abi from 'config/abi/erc721.json'
import MultiCallAbi from 'config/abi/Multicall.json'
import UserAgentAbi from 'config/abi/UserAgent.json'
import MysteryBoxAbi from 'config/abi/MysteryBox.json'
import GalaxyAbi from 'config/abi/Galaxy.json'
import PlanetAbi from 'config/abi/Planet.json'
import UserVaultAbi from 'config/abi/UserVault.json'

const getContract = (abi: any, address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  const signerOrProvider = signer ?? simpleRpcProvider
  return new ethers.Contract(address, abi, signerOrProvider)
}

export const getBep20Contract = (address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(bep20Abi, address, signer)
}
export const getErc721Contract = (address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(erc721Abi, address, signer)
}

export const getMulticallContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(MultiCallAbi, getMulticallAddress(), signer)
}

export const getUserAgentContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(UserAgentAbi, getUserAgentAddress(), signer)
}

export const getMysteryBoxContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(MysteryBoxAbi, getMysteryBoxAddress(), signer)
}

export const getGalaxyContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(GalaxyAbi, getGalaxyAddress(), signer)
}

export const getPlanetContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(PlanetAbi, getPlanetAddress(), signer)
}

export const getUserVaultContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(UserVaultAbi, getUserVaultAddress(), signer)
}

