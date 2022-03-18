import { Filters } from "./types";

export const darkFilter: Filters = {
  brightness: 'brightness(0.8)',
  grayscale: 'grayscale(95%)',
  blur: 'blur(32px)',
}

export const lightFilter: Filters = {
  brightness: 'brightness(1)',
  grayscale: 'grayscale(95%)',
  blur: 'blur(32px)',
}