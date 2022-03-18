import { MediaQueries, Breakpoints, Spacing, MediaQueriesSize } from "./types";

export const breakpointMap: { [key: string]: number } = {
  xxs: 369,
  xs: 370,
  sm: 576,
  md: 852,
  lg: 968,
  xl: 1080,
  xxl: 1280,
};

const breakpoints: Breakpoints = Object.values(breakpointMap).map((breakpoint) => `${breakpoint}px`);

export const mediaQueries: MediaQueries = {
  xxs: `@media screen and (max-width: ${breakpointMap.xs}px)`,
  xs: `@media screen and (min-width: ${breakpointMap.xs}px)`,
  sm: `@media screen and (min-width: ${breakpointMap.sm}px)`,
  md: `@media screen and (min-width: ${breakpointMap.md}px)`,
  lg: `@media screen and (min-width: ${breakpointMap.lg}px)`,
  xl: `@media screen and (min-width: ${breakpointMap.xl}px)`,
  xxl: `@media screen and (min-width: ${breakpointMap.xxl}px)`,
  nav: `@media screen and (min-width: ${breakpointMap.lg}px)`,
};

const mediaQueriesMargin = `
  ${mediaQueries.xxs} {
    margin: 8px 4px;
  }
  ${mediaQueries.xs} {
    margin: 16px 8px;
  }

  ${mediaQueries.sm} {
    margin: 16px 16px;
  }

  ${mediaQueries.lg} {
    margin: 16px 24px;
  }
  ${mediaQueries.xl} {
    margin: 24px 32px;
  }

`
const mediaQueriesMarginRight = `
  ${mediaQueries.xxs} {
    margin-right: 4px;
  }
  ${mediaQueries.xs} {
    margin-right: 8px;
  }

  ${mediaQueries.sm} {
    margin-right: 16px;
  }

  ${mediaQueries.lg} {
    margin-right: 24px;
  }
  ${mediaQueries.xl} {
    margin-right: 32px;
  }

`
const mediaQueriesPadding = `
  ${mediaQueries.xxs} {
    padding: 8px 4px;
  }
  ${mediaQueries.xl} {
    padding: 16px 8px;
  }

  ${mediaQueries.xs} {
    padding: 16px 8px;
  }

  ${mediaQueries.sm} {
    padding: 16px 16px;
  }

  ${mediaQueries.lg} {
    padding: 16px 24px;
  }
`

export const mediaQueriesSize: MediaQueriesSize = {
  margin: mediaQueriesMargin,
  marginr: mediaQueriesMarginRight,
  padding: mediaQueriesPadding,
}

export const shadows = {
  active: "0px 0px 0px 1px #0098A1, 0px 0px 4px 8px rgba(31, 199, 212, 0.4)",
  success: "0px 0px 0px 1px #31D0AA, 0px 0px 0px 4px rgba(49, 208, 170, 0.2)",
  warning: "0px 0px 0px 1px #ED4B9E, 0px 0px 0px 4px rgba(237, 75, 158, 0.2)",
  focus: "0px 0px 0px 1px #fbf2e9, 0px 0px 0px 4px rgba(77, 205, 179, 0.6)",
  input: "inset 0px 1px 3px 0px rgba(16, 64, 54, 0.21);",
  inset: "inset 0px 1px 3px 0px rgba(16, 64, 54, 0.21)",
  box: '0px 0px 21px 0px rgba(25, 95, 81, 0.2)',
  nav: '0px 0px 10px 0px rgba(51, 51, 51, 0.4)'
};

const spacing: Spacing = [0, 4, 8, 16, 24, 32, 48, 64];

const radii = {
  small: "4px",
  tag: "10px",
  default: "16px",
  nftImage: "10px",
  card: "20px",
  circle: "50%",
};

const zIndices = {
  dropdown: 10,
  modal: 100,
};

export default {
  siteWidth: 1200,
  breakpoints,
  mediaQueries,
  spacing,
  shadows,
  radii,
  zIndices,
  mediaQueriesSize,
};
