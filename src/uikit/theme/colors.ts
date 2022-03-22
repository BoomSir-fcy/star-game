import { Colors } from "./types";

export const baseColors = {
  failure: "#ED4B9E",
  primary: "#85C559",
  primaryBright: "#53DEE9",
  primaryDark: "#0098A1",
  secondary: "#7645D9",
  success: "#31D0AA",
  warning: "#FFB237",
  transparent: "transparent",
};

export const additionalColors = {
  binance: "#F0B90B",
  overlay: "rgba(98, 98, 98, 0.3)",
  gold: "#FFC700",
  silver: "#B2B2B2",
  bronze: "#E7974D",
  orange: "#FF780B",
};

export const nftTokenColors = {
  triangleDinosaur: "#F3A5C4",
  meat: "#8A260E",
};

export const lightColors: Colors = {
  ...baseColors,
  ...additionalColors,
  ...nftTokenColors,
  background: "#FAF9FA",
  backgroundModal: "#161920",
  backgroundDisabled: "#E9EAEB",
  backgroundCard: "#FFFFFF",
  backgroundAlt: "#FFFFFF",
  cardBorder: "#E7E3EB",
  invertedContrast: "#FFFFFF",
  input: "#F9F7F8",
  inputSecondary: "#d7caec",
  inputSelect: "#DBDBDB",
  tertiary: "#EFF4F5",
  text: "#283433",
  whiteBlack:'#000',
  memberNum:'#549A23',
  textPrimary: "#ADE58A",
  textSubtle: "#759290",
  textDisabled: "#BDC2C4",
  disabled: "#E9EAEB",
  gradients: {
    bubblegum: "linear-gradient(139.73deg, #E5FDFF 0%, #F3EFFF 100%)",
    inverseBubblegum: "linear-gradient(139.73deg, #F3EFFF 0%, #E5FDFF 100%)",
    cardHeader: "linear-gradient(111.68deg, #F2ECF2 0%, #E8F2F6 100%)",
    blue: "linear-gradient(180deg, #A7E8F1 0%, #94E1F2 100%)",
    violet: "linear-gradient(180deg, #E2C9FB 0%, #CDB8FA 100%)",
    violetAlt: "linear-gradient(180deg, #CBD7EF 0%, #9A9FD0 100%)",
    gold: "linear-gradient(180deg, #FFD800 0%, #FDAB32 100%)",
  },
};

export const darkColors: Colors = {
  ...baseColors,
  ...additionalColors,
  ...nftTokenColors,
  secondary: "#9A6AFF",
  background: "#08060B",
  backgroundModal: "#161920",
  backgroundDisabled: "#3c3742",
  backgroundCard: "#25302E",
  backgroundAlt: "#212827",
  cardBorder: "#383241",
  invertedContrast: "#191326",
  input: "#333E3C",
  inputSelect: "#333E3C",
  inputSecondary: "#262130",
  primaryDark: "#0098A1",
  tertiary: "#353547",
  text: "#FFFFFF",
  whiteBlack:'#FFFFFF',
  memberNum:'#FFFFFF',
  textPrimary: "#ADE58A",
  textSubtle: "#759290",
  textDisabled: "#666171",
  disabled: "#524B63",
  gradients: {
    bubblegum: "linear-gradient(139.73deg, #313D5C 0%, #3D2A54 100%)",
    inverseBubblegum: "linear-gradient(139.73deg, #3D2A54 0%, #313D5C 100%)",
    cardHeader: "linear-gradient(166.77deg, #3B4155 0%, #3A3045 100%)",
    blue: "linear-gradient(180deg, #00707F 0%, #19778C 100%)",
    violet: "linear-gradient(180deg, #6C4999 0%, #6D4DB2 100%)",
    violetAlt: "linear-gradient(180deg, #434575 0%, #66578D 100%)",
    gold: "linear-gradient(180deg, #FFD800 0%, #FDAB32 100%)",
  },
};
