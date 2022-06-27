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
  primary: string;
  highlight: string;
};

export type TextShadows = {
  primary: string;
  secondary: string;
  tertiary: string;
  green: string;
};

export type Gradients = {
  bubblegum: string;
  progress: string;
  card: string;
  stripe: string;
  stripeBg: string;
};

export const qualities = {
  ORDINARY: 1, // 普通
  GOOD: 2, // 良好
  RARE: 3, // 稀有
  EPIC: 4, // 史诗
  LEGEND: 5, // 传说
  MYTHOLOGY: 6, // 神话
} as const;

export const RaceType = {
  PROTOSS: 1, // 神族
  HUMAN: 2, // 人族
  ZERG: 3, // 虫族
};

export type Qualities = typeof qualities[keyof typeof qualities];
export type Races = typeof RaceType[keyof typeof RaceType];

export type Colors = {
  redText: string;
  legendText: string;
  profit: string;
  failure: string;
  warning: string;
  blueSide: string;
  redSide: string;
  hp: string;
  up: string;
  force: string;
  forceTips: string;
  input: string;
  inputSecondary: string;
  inputSelect: string;
  background: string;
  backgroundDisabled: string;
  backgroundCard: string;
  text: string;
  textLink: string;
  textSecondary: string;
  textDisabled: string;
  textSubtle: string;
  textPrimary: string;
  disabled: string;
  textTips: string;
  textSuccess: string;
  textDanger: string;

  raceProtoss: string;
  raceHuman: string;
  raceZerg: string;

  borderPrimary: string;
  border: string;
  goldBorder: string;
  lightBorder: string;
  // Gradients
  gradients: Gradients;
  progressBar: string;
  // Additional colors
  binance: string;
  overlay: string;
  gold: string;
  silver: string;
  bronze: string;
  navy: string;
  missTxt: string;
  progressGreenBar: string;
  progressSliderBackground: string;
  // NFT Token Colors
  triangleDinosaur: string;
  meat: string;
  textUp: string;
  white_black: string;

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
