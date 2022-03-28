export type Breakpoints = string[];

export type MediaQueries = {
  xxs: string;
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  xxl: string;
  nav: string;
};
export type MediaQueriesSize = {
  margin: string;
  padding: string;
};

export type BreakpointMap = {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  nav: number;
};

export type Spacing = number[];

export type Radii = {
  small: string;
  default: string;
  card: string;
  nftImage: string;
  tag: string;
  circle: string;
};

export type Shadows = {
  active: string;
  success: string;
  warning: string;
  focus: string;
  inset: string;
  box: string;
  nav: string;
};

export type TextShadows = {
  primary: string,
  secondary: string,
  tertiary: string,
};

export type Gradients = {
  bubblegum: string;
};

export const qualities = {
  ORDINARY: 'ordinary', // 普通
  GOOD: 'good', // 良好
  RARE: 'rare', // 稀有
  EPIC: 'epic', // 史诗
  LEGEND: 'legend', // 传说
  MYTHOLOGY: 'mythology', // 神话
} as const;

export type Qualities = typeof qualities[keyof typeof qualities];

export type Colors = {
  profit: string;
  failure: string;
  warning: string;
  blueSide: string;
  redSide: string;
  hp: string;
  input: string;
  inputSecondary: string;
  inputSelect: string;
  background: string;
  backgroundDisabled: string;
  backgroundCard: string;
  text: string;
  textSecondary: string;
  textDisabled: string;
  textSubtle: string;
  disabled: string;
  textTips: string;

  // Gradients
  gradients: Gradients;

  // Additional colors
  binance: string;
  overlay: string;
  gold: string;
  silver: string;
  bronze: string;
  navy: string;

  // NFT Token Colors
  triangleDinosaur: string;
  meat: string;

  // quality
  [qualities.ORDINARY]: string;
  [qualities.GOOD]: string;
  [qualities.RARE]: string;
  [qualities.EPIC]: string;
  [qualities.LEGEND]: string;
  [qualities.MYTHOLOGY]: string;
};

export type Filters = {
  brightness: string;
  grayscale: string;
  blur: string;
};

export type ZIndices = {
  dropdown: number;
  modal: number;
};
