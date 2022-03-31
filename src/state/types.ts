/* eslint-disable */
import { ThunkAction } from 'redux-thunk';
import { AnyAction } from '@reduxjs/toolkit';

// 性别
export enum Gender {
  MAN = 0,
  WOMAN = 1,
}

// 用户余额
export interface UserBalanceView {
  uid: number;
  coinId: string;
  amount: number;
  frozen: number;
  symbol: string;
  name: string;
  limitMini: number;
  limitMax: number;
  addTime: number;
  updatedAt: string;
}

export interface UserAgentInfoView {
  avatarNft_: string; // 头像nft的合约地址
  payToken_: string; // 要支付的token的合约地址
  userProfile_: string; // 用户信息合约地址
  price_: string; // 价格
  createdCount_: string; // 已创建数量
  loading?: boolean;
}

export interface UserInfoView {
  nickname: string;
  nftAddress: string;
  tokenId: number;
  isActive: boolean;
  superior: string;
  loading?: boolean;
}
export interface UserInfoState {
  userBalance: UserBalanceView[];
  infoView: UserAgentInfoView;
  userInfoView: UserInfoView;
  userInfo: Api.User.UserInfo;
  allowance: {
    allowance: string;
    loading: boolean;
  };
}

export interface MysteryBoxView {
  priceBNB: string[]; // 三种盲盒对应的bnb价格
  seedBlocks: number[]; // 三种盲盒对应的预定区块, 与当前区块相差超过230个区块应让用户重新预定
  burnRatio: string; // 销毁比例
  vdsgRatio: string; // 给vdsg的比例
  dsgPoolRatio: string; // 给dsg质押池的比例
  bnbPoolRatio: string; // 给bnb质押池的比例
  superiorRatio: string; // 给邀请人的比例
  defaultSuperior: string; // 默认邀请人
  miniDistributeAmount: string; //
  totalBurnt: string; // 总销毁量dsg
  totalVDsgDonated: string; // 总给vdsg的量dsg
  totalPoolSent: string; // 总给质押池的量dsg
  totalPoolSentBNB: string; // 总给质押池的量bnb
  loading?: boolean;
}

export interface MysteryBoxState {
  boxView: MysteryBoxView;
}

export interface GalaxyInfo extends Api.Galaxy.GalaxyInfo {
  id: number;
  label: string;
  starTotal?: number;
  starOwnerTotal?: number;
}

interface StarLevelInfo {
  id: number; // 恒星等级范围id
  label: string; // // 恒星等级范围名称
  levels: Api.Galaxy.StarInfo[];
}

export interface GalaxyState {
  currentGalaxy: GalaxyInfo;
  currentStarPeriod: StarLevelInfo;
  galaxyList: GalaxyInfo[];
  galaxyStarList: StarLevelInfo[];
  loading: boolean;
}

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  State,
  unknown,
  AnyAction
>;

export interface planetState {
  mePlanet: planetInfo[];
}
export interface State {
  userInfo: UserInfoState;
  mysteryBox: MysteryBoxState;
  galaxy: GalaxyState;
  alliance: AllianceState;
  planet: planetState;
}

export interface planetInfo {
  id: number;
  name: string;
  owner: string;
  oldOwner: string;
  rarity: number;
  level: number;
  strengthenLevel: number;
  working: boolean;
  workTime: number;
  areaX: number;
  areaY: number;
  oreYield: number;
  oreConsumption: number;
  energyYield: number;
  energyConsumption: number;
  populationYield: number;
  populationConsumption: number;
  settleAt: number;
  addTime: number;
  update_finish_time: number;
  strengthen_finish_time: number;
}
export interface allianceInfo {
  id: number;
  uid: number;
  beforeStoneCap: string;
  beforePopulationCap: string;
  beforeEnergyCap: string;
  createTime: number;
  laterExtractTime: number;
  power: number;
  working: number;
}

export interface orderInfo {
  id: number;
  planetId: number;
  order: number;
  uid: number;
  planet: planetInfo;
}
export interface energyInfo {
  total_population: number;
  total_stone: number;
  total_energy: number;
  per_population: number;
  per_stone: number;
  per_energy: number;
}
export interface AllianceView {
  alliance: allianceInfo;
  order: orderInfo[];
  energy: energyInfo;
}
export interface AllianceState {
  allianceView: AllianceView;
}
