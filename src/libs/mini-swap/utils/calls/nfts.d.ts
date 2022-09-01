export declare const startSalesNft: (masterChefContract: any, id: any, maxPrice: any, minPrice: any, startTime: any, durationTime: any, nft: any, currency: any, decimal?: number) => Promise<any>;
export declare const cancelSalesNft: (masterChefContract: any, id: any) => Promise<any>;
export declare const startBuyNft: (masterChefContract: any, id: any, value: any) => Promise<any>;
export declare const upgradeNft: (masterChefContract: any, nftId: any, materialNftId: any) => Promise<any>;
export declare const transferFromNft: (masterChefContract: any, sender: any, recipient: any, tokenId: any) => Promise<any>;
