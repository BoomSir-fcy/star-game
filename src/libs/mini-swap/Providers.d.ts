import { DeepPartial } from 'redux';
import React from 'react';
import { PancakeTheme } from 'pancake-uikit';
import { SupportLanguage } from 'config/localization/languages';
export declare type Theme = DeepPartial<PancakeTheme>;
interface ThemeProps {
    dark: Theme;
    light: Theme;
}
export interface ProvidersPorps {
    isDark?: boolean;
    chainId?: number;
    resetTheme?: ThemeProps;
    lang?: SupportLanguage;
    onConnectWallet?: () => void;
}
declare const Providers: React.FC<ProvidersPorps>;
export default Providers;
