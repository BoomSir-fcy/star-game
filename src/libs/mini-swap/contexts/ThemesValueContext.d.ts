import React from 'react';
import { PancakeTheme } from 'pancake-uikit';
import { DeepPartial } from 'redux';
export declare type Theme = DeepPartial<PancakeTheme>;
interface ThemeProps {
    dark: Theme;
    light: Theme;
}
declare const ThemesValue: React.Context<ThemeProps>;
declare const ThemesValueProvider: ({ children, light, dark }: {
    children: any;
    light: any;
    dark: any;
}) => JSX.Element;
export { ThemesValue, ThemesValueProvider };
