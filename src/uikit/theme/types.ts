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
  marginr: string;
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

export type Gradients = {
  bubblegum: string;
  inverseBubblegum: string;
  cardHeader: string;
  blue: string;
  violet: string;
  violetAlt: string;
  gold: string;
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
  primary: string;
  primaryBright: string;
  primaryDark: string;
  secondary: string;
  tertiary: string;
  success: string;
  failure: string;
  warning: string;
  cardBorder: string;
  invertedContrast: string;
  input: string;
  inputSecondary: string;
  inputSelect: string;
  background: string;
  backgroundDisabled: string;
  backgroundAlt: string;
  backgroundModal: string;
  backgroundCard: string;
  text: string;
  whiteBlack: string;
  memberNum: string;
  textPrimary: string;
  textDisabled: string;
  textSubtle: string;
  disabled: string;

  // Gradients
  gradients: Gradients;

  // Additional colors
  binance: string;
  overlay: string;
  gold: string;
  silver: string;
  bronze: string;

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
  brightness: string
  grayscale: string
  blur: string
}

export type ZIndices = {
  dropdown: number;
  modal: number;
};
