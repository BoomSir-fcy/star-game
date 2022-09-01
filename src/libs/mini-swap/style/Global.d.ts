import { PancakeTheme } from 'pancake-uikit';
declare module 'styled-components' {
    interface DefaultTheme extends PancakeTheme {
    }
}
declare const GlobalStyle: import("styled-components").GlobalStyleComponent<{}, import("styled-components").DefaultTheme>;
export default GlobalStyle;
