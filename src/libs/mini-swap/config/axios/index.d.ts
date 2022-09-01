interface QueryParams {
    [elem: string]: any;
}
export declare const get: (url: string, params?: QueryParams) => Promise<any>;
export declare const get1inch: (url: string, params?: QueryParams) => Promise<any>;
export declare const post: (url: string, data?: QueryParams, config?: {}) => Promise<any>;
export declare const getNftInfo: (token: string, id: string | number) => Promise<any>;
export declare const getMysteryNftInfo: (id: string | number) => Promise<any>;
export declare const getNftsList: (account: string) => Promise<any>;
export declare const getMarketSales: (data: QueryParams) => Promise<any>;
export declare const getMarketSalesSum: (data: QueryParams) => Promise<any>;
export declare const nftsFilter: (data: QueryParams) => Promise<any>;
export declare const getMysteryboxFactories: () => Promise<any>;
export declare const get1inchQuoteData: (chainId: number, data: QueryParams) => Promise<any>;
export declare const get1inchSwapData: (chainId: number, data: QueryParams) => Promise<any>;
export declare const get1inchApproveCallData: (chainId: number, data: QueryParams) => Promise<any>;
export declare const get1inchApproveSpender: (chainId: number, data?: QueryParams) => Promise<any>;
export declare const postTest: (params: QueryParams) => Promise<any>;
export {};
