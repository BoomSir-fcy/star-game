import { ethers } from 'ethers';

export const getLibrary = (provider: ethers.providers.ExternalProvider | ethers.providers.JsonRpcFetchFunc): ethers.providers.Web3Provider => {
  const library = new ethers.providers.Web3Provider(provider);
  library.pollingInterval = 12000
  return library
}