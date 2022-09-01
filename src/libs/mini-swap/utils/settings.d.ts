import BigNumber from 'bignumber.js';
export interface UserSettings {
    gasPrice: number;
}
export declare const VERSION = 1.01;
export declare const GAS_SETTINGS: {
    default: number;
    fast: number;
    reallyfast: number;
};
export declare const getGasPriceInWei: (amountInGwei: number) => BigNumber;
export declare const getDefaultSettings: () => UserSettings;
export declare const getStorageKey: (account: string) => string;
export declare const getSettings: (account: string) => UserSettings;
export declare const setSettings: (account: string, newSettings: UserSettings) => void;
export declare const setSetting: (account: string, newSetting: Partial<UserSettings>) => void;
