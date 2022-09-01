declare const useTheme: () => {
    isDark: boolean;
    theme: import("styled-components").DefaultTheme;
    toggleTheme: () => void;
};
export default useTheme;
