import { Colors, qualities, RaceType } from './types';

export const baseColors = {
  failure: '#FF3A3A',
  warning: '#FF7272',
  profit: '#52FF83',
  blueSide: '#2CCFFF',
  redSide: '#EB5231',
  hp: '#FFAC36',
  up: '#ECA320',
  force: '#F55B5A',
};

export const additionalColors = {
  binance: '#F0B90B',
  overlay: 'rgba(98, 98, 98, 0.3)',
  gold: '#FFC700',
  silver: '#B2B2B2',
  bronze: '#E7974D',
  orange: '#FF780B',
  navy: '#35CEB7',
};

export const nftTokenColors = {
  triangleDinosaur: '#F3A5C4',
  meat: '#8A260E',
};

export const QualityColor = {
  [qualities.ORDINARY]: '#FFFFFF',
  [qualities.GOOD]: '#58DB6B',
  [qualities.RARE]: '#3D98FF',
  [qualities.EPIC]: '#D259EC',
  [qualities.LEGEND]: '#FFB93D',
  [qualities.MYTHOLOGY]: '#FF6F3D',
};

export const RaceTypeColor = {
  [RaceType.PROTOSS]: '#DF7DFD',
  [RaceType.HUMAN]: '#3dcfff',
  [RaceType.ZERG]: '#DF7DFD',
};

export const lightColors: Colors = {
  ...baseColors,
  ...additionalColors,
  ...nftTokenColors,
  ...QualityColor,
  background: '#FAF9FA',
  backgroundDisabled: '#E9EAEB',
  backgroundCard: '#161920',
  input: '#161920',
  inputSecondary: '#173271',
  inputSelect: '#DBDBDB',
  text: '#283433',
  textLink: '#3A97FF',
  textSecondary: '#D7C6C0',
  textSubtle: '#9DB3C4',
  textDisabled: '#BDC2C4',
  disabled: '#E9EAEB',
  textTips: '#7D879C',
  textSuccess: '#84FF59',
  textDanger: '#FF5353',
  raceProtoss: '#DF7DFD',
  raceHuman: '#3dcfff',
  raceZerg: '#8ac001',
  goldBorder: '#8ac001',
  lightBorder: '#f9feff',
  progressBar: 'linear-gradient(180deg, #26DAE1, #38327B)',
  gradients: {
    bubblegum: 'linear-gradient(139.73deg, #E5FDFF 0%, #F3EFFF 100%)',
    progress: 'linear-gradient(180deg, #1E5D7D, #27395F)',
  },
};

export const darkColors: Colors = {
  ...baseColors,
  ...additionalColors,
  ...nftTokenColors,
  ...QualityColor,
  background: '#08060B',
  backgroundDisabled: '#3c3742',
  backgroundCard: '#161920',
  input: '#161920',
  inputSelect: '#333E3C',
  inputSecondary: '#173271',
  text: '#FFFFFF',
  textLink: '#3A97FF',
  textSecondary: '#D7C6C0',
  textSubtle: '#9DB3C4',
  textDisabled: '#666171',
  disabled: '#524B63',
  textTips: '#7D879C',
  textSuccess: '#84FF59',
  textDanger: '#FF5353',
  raceProtoss: '#DF7DFD',
  raceHuman: '#3dcfff',
  raceZerg: '#8ac001',
  goldBorder: '#EB9C12',
  lightBorder: '#f9feff',
  progressBar: 'linear-gradient(180deg, #26DAE1, #38327B)',
  gradients: {
    bubblegum: 'linear-gradient(139.73deg, #313D5C 0%, #3D2A54 100%)',
    progress: 'linear-gradient(180deg, #1E5D7D, #27395F)',
  },
};
