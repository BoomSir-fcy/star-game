import ethers from 'ethers';
export declare type MultiCallResponse<T> = T | null;
export declare type PredictionsClaimableResponse = boolean;
export interface PredictionsLedgerResponse {
    position: 0 | 1;
    amount: ethers.BigNumber;
    claimed: boolean;
}
export declare type PredictionsRefundableResponse = boolean;
export interface PredictionsRoundsResponse {
    epoch: ethers.BigNumber;
    startBlock: ethers.BigNumber;
    lockBlock: ethers.BigNumber;
    endBlock: ethers.BigNumber;
    lockPrice: ethers.BigNumber;
    closePrice: ethers.BigNumber;
    totalAmount: ethers.BigNumber;
    bullAmount: ethers.BigNumber;
    bearAmount: ethers.BigNumber;
    rewardBaseCalAmount: ethers.BigNumber;
    rewardAmount: ethers.BigNumber;
    oracleCalled: boolean;
}
export interface BidsPerAuction {
    account: string;
    amount: ethers.BigNumber;
}
export declare type ViewBidsPerAuctionResponse = [BidsPerAuction[], ethers.BigNumber];
export declare type ViewBidderAuctionsResponse = [ethers.BigNumber[], ethers.BigNumber[], boolean[], ethers.BigNumber];
