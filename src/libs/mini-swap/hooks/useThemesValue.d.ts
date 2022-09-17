declare const useThemesValue: () => {
    dark: import("redux").DeepPartial<import("../pancake-uikit").PancakeTheme>;
    light: import("redux").DeepPartial<import("../pancake-uikit").PancakeTheme>;
};
export default useThemesValue;
