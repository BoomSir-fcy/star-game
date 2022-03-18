import { CardTheme } from "../components/Card/types";
import { Colors, Breakpoints, MediaQueries, Spacing, Shadows, Radii, ZIndices, MediaQueriesSize, Filters } from "./types";

export interface PancakeTheme {
  siteWidth: number;
  isDark: boolean;
  filter: Filters;
  colors: Colors;
  card: CardTheme;
  breakpoints: Breakpoints;
  mediaQueries: MediaQueries;
  spacing: Spacing;
  shadows: Shadows;
  radii: Radii;
  zIndices: ZIndices;
  mediaQueriesSize: MediaQueriesSize;
}

export { default as dark } from "./dark";
export { default as light } from "./light";

export { lightColors } from "./colors";
export { darkColors } from "./colors";
