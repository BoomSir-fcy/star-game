import { light, dark } from 'uikit';

export default {
  dark: {
    colors: {
      dropdown: dark.colors.input,
      failure: light.colors.failure,
      text: dark.colors.text,
      backgroundDisabled: dark.colors.backgroundDisabled,
      primary: dark.colors.textPrimary,
      success: dark.colors.textSuccess,
      textSubtle: dark.colors.textTips,
      backgroundAlt: dark.colors.backgroundCard,
      background: dark.colors.background,
      dropdownDeep: dark.colors.backgroundCard,
      invertedContrast: dark.colors.backgroundCard,
    },
    shadows: {
      inset: 'none',
      box: 'none',
      success: '',
    },
    modal: {
      background: dark.colors.backgroundCard,
    },
    card: {
      boxShadow: '',
      background: dark.colors.backgroundCard,
    },
    zIndices: {
      modal: 9999,
    },
  },
  light: {
    colors: {
      dropdown: light.colors.input,
      failure: light.colors.failure,
      text: light.colors.text,
      backgroundDisabled: light.colors.input,
      primary: light.colors.text,
      success: light.colors.textSuccess,
      textSubtle: light.colors.textTips,
      backgroundAlt: light.colors.backgroundCard,
      background: light.colors.background,
      input: light.colors.input,
      dropdownDeep: light.colors.backgroundCard,
      invertedContrast: light.colors.backgroundCard,
    },
    shadows: {
      inset: 'none',
      box: 'none',
    },
    card: {
      boxShadow: '',
      background: light.colors.backgroundCard,
    },
    zIndices: {
      modal: 9999,
    },
    tooltip: {
      background: dark.colors.background,
      text: dark.colors.text,
      boxShadow: 'none',
    },
  },
};
