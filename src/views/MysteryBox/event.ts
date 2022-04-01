import { getPlanetContract } from 'utils/contractHelpers';
import { simpleRpcProvider } from 'utils/providers';

export const queryMintEvent = async (address?: string) => {
  try {
    const contract = getPlanetContract();
    // event Mint(address indexed user, uint256 planetId, string name, uint rarity);
    const blockNumber = await simpleRpcProvider.getBlockNumber();
    const filter = contract.filters.Mint(address);
    const eveSales = await contract.queryFilter(filter, blockNumber - 1000);
    return eveSales;
  } catch (error) {
    console.error(error);
    return [];
  }
};
