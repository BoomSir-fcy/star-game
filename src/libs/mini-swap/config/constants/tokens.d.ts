import { Token } from 'dsgswap-sdk';
export declare const USDT: {
    [chainId: number]: Token;
};
declare const tokens: {
    bnb: {
        symbol: string;
        projectLink: string;
        address: {
            56: string;
            97: string;
        };
        decimals: number;
    };
    dsg: {
        symbol: string;
        address: {
            56: string;
            97: string;
            80001: string;
        };
        decimals: number;
        projectLink: string;
    };
    box: {
        symbol: string;
        address: {
            56: string;
            97: string;
            80001: string;
        };
        decimals: number;
        projectLink: string;
        name: string;
    };
    energy: {
        symbol: string;
        address: {
            56: string;
            97: string;
            80001: string;
        };
        decimals: number;
        projectLink: string;
        name: string;
    };
    spices: {
        symbol: string;
        address: {
            56: string;
            97: string;
            80001: string;
        };
        decimals: number;
        projectLink: string;
        name: string;
    };
    ore: {
        symbol: string;
        address: {
            56: string;
            97: string;
            80001: string;
        };
        decimals: number;
        projectLink: string;
        name: string;
    };
};
export declare const BOX: {
    [chainId: number]: Token;
};
export declare const ORE: {
    [chainId: number]: Token;
};
export declare const SPICES: {
    [chainId: number]: Token;
};
export declare const ENERGY: {
    [chainId: number]: Token;
};
export default tokens;
