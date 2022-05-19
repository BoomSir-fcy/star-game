import {
  getDsgAddress,
  getTimeAddress,
  getMatterAddress,
} from './addressHelpers';

const getTokenLogoURLs = (address?: string): string[] => {
  if (getTimeAddress().toLowerCase() === address?.toLowerCase())
    return ['/images/tokens/TIME.svg'];
  if (getDsgAddress().toLowerCase() === address?.toLowerCase())
    return ['/images/tokens/DSG.svg'];
  if (getMatterAddress().toLowerCase() === address?.toLowerCase())
    return ['/images/tokens/MATTER.svg'];
  if (address === 'BNB') return ['/images/tokens/BNB.svg'];
  return [
    `/images/tokens/${address}.svg`,
    `/images/tokens/${address}.png`,
    `https://sv.dsgmetaverse.com/images/tokens/${address}.svg`,
    `https://sv.dsgmetaverse.com/images/tokens/${address}.png`,
    `https://tokens.pancakeswap.finance/images/${address}.png`,
    `https://assets.trustwalletapp.com/blockchains/smartchain/assets/${address}/logo.png`,
  ];
};

export default getTokenLogoURLs;
