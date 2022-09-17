import BigNumber from 'bignumber.js';
import { AddressForChainId } from 'dsgswap-sdk';
import { SerializedBigNumber, TranslatableText } from 'state/types';
export interface Address extends AddressForChainId {
}
export interface Token {
    symbol: string;
    address?: Address;
    decimals?: number;
    projectLink?: string;
    busdPrice?: string;
}
export declare enum PoolIds {
    poolBasic = "poolBasic",
    poolUnlimited = "poolUnlimited"
}
export declare type IfoStatus = 'idle' | 'coming_soon' | 'live' | 'finished';
interface IfoPoolInfo {
    saleAmount: string;
    raiseAmount: string;
    cakeToBurn: string;
    distributionRatio: number;
}
export interface Ifo {
    id: string;
    isActive: boolean;
    address: string;
    name: string;
    currency: Token;
    token: Token;
    releaseBlockNumber: number;
    articleUrl: string;
    campaignId: string;
    tokenOfferingPrice: number;
    version: number;
    [PoolIds.poolBasic]?: IfoPoolInfo;
    [PoolIds.poolUnlimited]: IfoPoolInfo;
}
export declare enum PoolCategory {
    'COMMUNITY' = "Community",
    'CORE' = "Core",
    'BINANCE' = "Binance",
    'AUTO' = "Auto"
}
export declare enum FarmTypes {
    LP_FARM = 0,
    ERC20_EARN_NFT = 1,
    NFT_EARN_ERC20 = 2
}
interface FarmToken extends Token {
    token?: string;
}
export interface FarmConfig {
    pid: number;
    liquidityPoolAddress?: string;
    lpSymbol: string;
    lpAddresses: Address;
    token: FarmToken;
    quoteToken: FarmToken;
    multiplier?: string;
    isCommunity?: boolean;
    dual?: {
        rewardPerBlock: number;
        earnLabel: string;
        endBlock: number;
    };
}
export interface PoolConfig {
    sousId: number;
    earningToken: Token;
    stakingToken: Token;
    contractAddress: Address;
    poolCategory: PoolCategory;
    tokenPerBlock: string;
    sortOrder?: number;
    harvest?: boolean;
    isFinished?: boolean;
    enableEmergencyWithdraw?: boolean;
}
export declare type Images = {
    lg: string;
    md: string;
    sm: string;
    ipfs?: string;
};
export declare type NftImages = {
    blur?: string;
} & Images;
export declare type NftVideo = {
    webm: string;
    mp4: string;
};
export declare type NftSource = {
    [key in NftType]: {
        address: Address;
        identifierKey: string;
    };
};
export declare enum NftType {
    PANCAKE = "pancake",
    MIXIE = "mixie"
}
export declare type Nft = {
    description: string;
    name: string;
    images: NftImages;
    sortOrder: number;
    type: NftType;
    video?: NftVideo;
    identifier: string;
    variationId?: number | string;
};
export declare type TeamImages = {
    alt: string;
} & Images;
export declare type Team = {
    id: number;
    name: string;
    description: string;
    isJoinable?: boolean;
    users: number;
    points: number;
    images: TeamImages;
    background: string;
    textColor: string;
};
export declare type CampaignType = 'ifo' | 'teambattle' | 'participation';
export declare type Campaign = {
    id: string;
    type: CampaignType;
    title?: TranslatableText;
    description?: TranslatableText;
    badge?: string;
};
export declare type PageMeta = {
    title: string;
    description?: string;
    image?: string;
};
export declare enum LotteryStatus {
    PENDING = "pending",
    OPEN = "open",
    CLOSE = "close",
    CLAIMABLE = "claimable"
}
export interface LotteryTicket {
    id: string;
    number: string;
    status: boolean;
    rewardBracket?: number;
    roundId?: string;
    cakeReward?: SerializedBigNumber;
}
export interface LotteryTicketClaimData {
    ticketsWithUnclaimedRewards: LotteryTicket[];
    allWinningTickets: LotteryTicket[];
    cakeTotal: BigNumber;
    roundId: string;
}
export declare enum AuctionStatus {
    ToBeAnnounced = 0,
    Pending = 1,
    Open = 2,
    Finished = 3,
    Closed = 4
}
export interface Auction {
    id: number;
    status: AuctionStatus;
    startBlock: number;
    startDate: Date;
    endBlock: number;
    endDate: Date;
    auctionDuration: number;
    farmStartBlock: number;
    farmStartDate: Date;
    farmEndBlock: number;
    farmEndDate: Date;
    initialBidAmount: number;
    topLeaderboard: number;
    leaderboardThreshold: BigNumber;
}
export interface BidderAuction {
    id: number;
    amount: BigNumber;
    claimed: boolean;
}
export declare enum FetchStatus {
    NOT_FETCHED = "not-fetched",
    SUCCESS = "success",
    FAILED = "failed",
    LOADING = "loading",
    DATA_END = "dataEnd",
    REFRESH = "refresh"
}
export declare enum TimeQueryFilter {
    ALL_TIME = 0,
    LAST_24_HOURS = 86400,
    LAST_7_DAYS = 604800,
    LAST_30_DAYS = 2592000
}
export {};
