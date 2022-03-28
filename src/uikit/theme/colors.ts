import { Colors, qualities } from './types';

export const baseColors = {
  failure: '#FF3A3A',
  warning: '#FF7272',
  profit: '#52FF83',
  blueSide: '#2CCFFF',
  redSide: '#EB5231',
  hp: '#FFAC36',
};

export const additionalColors = {
  binance: '#F0B90B',
  overlay: 'rgba(98, 98, 98, 0.3)',
  gold: '#FFC700',
  silver: '#B2B2B2',
  bronze: '#E7974D',
  orange: '#FF780B',
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
  gradients: {
    bubblegum: 'linear-gradient(139.73deg, #E5FDFF 0%, #F3EFFF 100%)',
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
  gradients: {
    bubblegum: 'linear-gradient(139.73deg, #313D5C 0%, #3D2A54 100%)',
  },
};
