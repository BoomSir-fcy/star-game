import { DefaultTheme } from "styled-components";
import { light as lightCard } from "../components/Card/theme";
import base from "./base";
import { lightColors } from "./colors";
import { lightFilter } from "./filter";

const lightTheme: DefaultTheme = {
  ...base,
  isDark: false,
  filter: lightFilter,
  colors: lightColors,
  card: lightCard,
};

export default lightTheme;
