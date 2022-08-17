import { useMemo } from 'react';
import { Contract } from '@ethersproject/contracts';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import {
  getBep20Contract,
  getErc721Contract,
  getUserAgentContract,
  getMysteryBoxContract,
  getGalaxyContract,
  getPlanetContract,
  getUserVaultContract,
  getCoinContract,
} from 'utils/contractHelpers';
import { getMulticallAddress, getWEtherAddress } from 'utils/addressHelpers';
import { getContract } from 'utils';

import ERC20_ABI from 'config/abi/erc20.json';
import WETH_ABI from 'config/abi/weth.json';
import MULTICALL_ABI from 'config/abi/Multicall.json';

/**
 * Helper hooks to get specific contracts (by ABI)
 */

export const useERC20 = (address: string) => {
  const { library } = useActiveWeb3React();
  return useMemo(
    () => getBep20Contract(address, library?.getSigner()),
    [address, library],
  );
};

/**
 * @see https://docs.openzeppelin.com/contracts/3.x/api/token/erc721
 */
export const useERC721 = (address: string) => {
  const { library } = useActiveWeb3React();
  return useMemo(
    () => getErc721Contract(address, library?.getSigner()),
    [address, library],
  );
};

// returns null on errors
function useContract(
  address: string | undefined,
  ABI: any,
  withSignerIfPossible = true,
): Contract | null {
  const { library, account } = useActiveWeb3React();

  return useMemo(() => {
    if (!address || !ABI || !library) return null;
    try {
      return getContract(
        address,
        ABI,
        library,
        withSignerIfPossible && account ? account : undefined,
      );
    } catch (error) {
      console.error('Failed to get contract', error);
      return null;
    }
  }, [address, ABI, library, withSignerIfPossible, account]);
}

export function useTokenContract(
  tokenAddress?: string,
  withSignerIfPossible?: boolean,
): Contract | null {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible);
}

export function useWETHContract(
  withSignerIfPossible?: boolean,
): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(
    chainId ? getWEtherAddress() : undefined,
    WETH_ABI,
    withSignerIfPossible,
  );
}

export function useMulticallContract(): Contract | null {
  return useContract(getMulticallAddress(), MULTICALL_ABI, false);
}

export const useUserAgentContract = () => {
  const { library } = useActiveWeb3React();
  return useMemo(() => getUserAgentContract(library?.getSigner()), [library]);
};

export const useMysteryBoxContract = () => {
  const { library } = useActiveWeb3React();
  return useMemo(() => getMysteryBoxContract(library?.getSigner()), [library]);
};

export const useGalaxyContract = () => {
  const { library } = useActiveWeb3React();
  return useMemo(() => getGalaxyContract(library?.getSigner()), [library]);
};

export const usePlanetContract = () => {
  const { library } = useActiveWeb3React();
  return useMemo(() => getPlanetContract(library?.getSigner()), [library]);
};

export const useUserVaultContract = () => {
  const { library } = useActiveWeb3React();
  return useMemo(() => getUserVaultContract(library?.getSigner()), [library]);
};

export const useGetCoinContract = () => {
  const { library } = useActiveWeb3React();
  return useMemo(() => getCoinContract(library?.getSigner()), [library]);
};
