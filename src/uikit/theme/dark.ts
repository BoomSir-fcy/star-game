import { DefaultTheme } from "styled-components";
import { dark as darkCard } from "../components/Card/theme";
import base from "./base";
import { darkColors } from "./colors";
import { darkFilter } from "./filter";

const darkTheme: DefaultTheme = {
  ...base,
  isDark: true,
  filter: darkFilter,
  colors: darkColors,
  card: darkCard,
};

export default darkTheme;
