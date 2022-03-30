// import { ChainId } from 'dsgswap-sdk'
import { ChainId } from 'config/wallet/config';

import addresses from 'config/constants/contracts';

type Address = {
  [chain in ChainId]?: string;
};

export const getAddress = (address: Partial<Address>): string => {
  const chainId: ChainId = process.env.REACT_APP_CHAIN_ID as unknown as ChainId;
  if (address[chainId]) {
    return address[chainId] as string;
  }
  return address[ChainId.MAINNET] as string;
};

export const getMulticallAddress = () => {
  return getAddress(addresses.multiCall);
};
export const getWEtherAddress = () => {
  return getAddress(addresses.WBNB);
};

export const getDsgAddress = () => {
  return getAddress(addresses.DsgToken);
};

export const getTimeAddress = () => {
  return getAddress(addresses.TimeToken);
};

export const getMatterAddress = () => {
  return getAddress(addresses.MatterToken);
};

export const getUserAgentAddress = () => {
  return getAddress(addresses.UserAgent);
};

export const getMysteryBoxAddress = () => {
  return getAddress(addresses.MysteryBox);
};

export const getGalaxyAddress = () => {
  return getAddress(addresses.Galaxy);
};

export const getPlanetAddress = () => {
  return getAddress(addresses.Planet);
};

export const getUserVaultAddress = () => {
  return getAddress(addresses.UserVault);
};

export const getBoxAddress = () => {
  return getAddress(addresses.BoxToken);
};
